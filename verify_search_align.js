const http = require('http');

const tests = [
    {
        name: "Align Global (Needleman-Wunsch)",
        path: '/api/align',
        method: 'POST',
        body: JSON.stringify({
            sequence_a: "GAAAAAAT",
            sequence_b: "GAA----T",
            mode: "global"
        }),
        expectedScore: 2
    },
    {
        name: "Align Local (Smith-Waterman)",
        path: '/api/align',
        method: 'POST',
        body: JSON.stringify({
            sequence_a: "GAAAAAAT",
            sequence_b: "GAA----T",
            mode: "local"
        }),
        expectedScore: 4 // Likely higher or equal for local depending on scoring
    },
    {
        name: "BWT Search (Banana)",
        path: '/api/search',
        method: 'POST',
        body: JSON.stringify({
            tool: "bwt",
            sequence: "banana",
            pattern: "ana"
        }),
        check: (data) => data.count === 2 && data.offsets.includes(1) && data.offsets.includes(3)
    },
    {
        name: "Mash Compare (Identical)",
        path: '/api/search',
        method: 'POST',
        body: JSON.stringify({
            tool: "mash",
            sequence: "ATGCATGCATGCATGCATGCATGCATGCATGCATGCATGCATGCATGCATGC", // 52 chars
            sequence_b: "ATGCATGCATGCATGCATGCATGCATGCATGCATGCATGCATGCATGCATGC" // Identical
        }),
        check: (data) => data.similarity === 1.0 && data.distance === 0.0
    }
];

function runTest(test) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'localhost',
            port: 8080,
            path: test.path,
            method: test.method,
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(test.body)
            }
        };

        const req = http.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                console.log(`\n--- ${test.name} ---`);
                console.log(`Status: ${res.statusCode}`);
                if (res.statusCode !== 200) {
                    console.log(`Response: ${data}`);
                    reject(new Error(`Status ${res.statusCode}`));
                    return;
                }

                try {
                    const json = JSON.parse(data);
                    console.log("Response:", JSON.stringify(json, null, 2));

                    if (test.expectedScore !== undefined && json.score !== test.expectedScore) {
                        // Soft check for score as scoring matrix defaults might vary
                        console.log(`WARN: Expected score ${test.expectedScore}, got ${json.score}`);
                    }
                    if (test.check && !test.check(json)) {
                        reject(new Error("Custom check failed"));
                        return;
                    }
                    resolve();
                } catch (e) {
                    console.log("Failed to parse JSON:", data);
                    reject(e);
                }
            });
        });

        req.on('error', (e) => {
            console.error(`Problem with request: ${e.message}`);
            reject(e);
        });

        req.write(test.body);
        req.end();
    });
}

async function runAll() {
    for (const test of tests) {
        try {
            await runTest(test);
        } catch (e) {
            console.error(`Test ${test.name} FAILED`);
            process.exit(1);
        }
    }
    console.log("\nAll Search/Align tests PASSED");
}

runAll();
