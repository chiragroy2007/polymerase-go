$baseUrl = "http://localhost:8080/api"

function Test-Endpoint {
    param (
        [string]$Name,
        [string]$Endpoint,
        [hashtable]$Body
    )
    Write-Host "Testing $Name..." -NoNewline
    try {
        $jsonBody = $Body | ConvertTo-Json
        $response = Invoke-RestMethod -Method Post -Uri "$baseUrl/$Endpoint" -ContentType "application/json" -Body $jsonBody -ErrorAction Stop
        Write-Host " OK" -ForegroundColor Green
        # Write-Host ($response | ConvertTo-Json -Depth 2)
    } catch {
        Write-Host " FAILED" -ForegroundColor Red
        Write-Host $_.Exception.Message
        if ($_.Exception.Response) {
            $stream = $_.Exception.Response.GetResponseStream()
            $reader = New-Object System.IO.StreamReader($stream)
            Write-Host $reader.ReadToEnd()
        }
    }
}

# 1. RevComp
Test-Endpoint -Name "Reverse Complement" -Endpoint "revcomp" -Body @{ sequence = "ATGC" }

# 2. Codon Optimize
Test-Endpoint -Name "Codon Optimization" -Endpoint "codon-optimize" -Body @{ protein_sequence = "MKT"; organism = "E. coli" }

# 3. Align
Test-Endpoint -Name "Alignment" -Endpoint "align" -Body @{ sequence_a = "ATGC"; sequence_b = "ATGG" }

# 4. Translate
Test-Endpoint -Name "Translation" -Endpoint "translate" -Body @{ sequence = "ATGC" }

# 5. Primer Design
Test-Endpoint -Name "Primer Design" -Endpoint "primer-design" -Body @{ sequence = "ATGCATGCATGCATGCATGCATGCATGCATGCATGCATGC" }

# 6. Random
Test-Endpoint -Name "Random DNA" -Endpoint "random" -Body @{ type = "DNA"; length = 50 }

# 7. SeqHash
Test-Endpoint -Name "SeqHash" -Endpoint "seqhash" -Body @{ sequence = "ATGC"; type = "DNA"; circular = $false; double_stranded = $false }

# 8. Checks
Test-Endpoint -Name "Checks" -Endpoint "checks" -Body @{ sequence = "ATGC" }

# 9. Fold
Write-Host "Testing Fold..." -NoNewline
try {
    $body = @{ sequence = "GGGAAAUCC"; temperature = 37.0 } | ConvertTo-Json
    $response = Invoke-RestMethod -Method Post -Uri "$baseUrl/fold" -ContentType "application/json" -Body $body -ErrorAction Stop
    Write-Host " OK" -ForegroundColor Green
    Write-Host ($response | ConvertTo-Json -Depth 2)
} catch {
    Write-Host " FAILED" -ForegroundColor Red
    Write-Host $_.Exception.Message
}
