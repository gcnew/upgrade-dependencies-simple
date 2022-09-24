
const fs = require('fs');
const https = require('https');

function die(message) {
    console.error(message);
    process.exit(1);
}

function fetch(url) {
    return new Promise((resolve, reject) => {
        const rq = https.get(url, res => {
            if (res.statusCode !== 200) {
                return reject(`Cannot fetch URL:${url}`)
            }

            const body = [];
            res.on('data', chunk => body.push(chunk));
            res.on('end', () => resolve(Buffer.concat(body).toString('utf8')));
        });

        rq.on('error', err => reject(err));
        rq.end();
    });
}

function getLatestVersions(deps) {
    if (!deps) {
        return [];
    }

    return Object.keys(deps)
        .map(async pkg => {
            const res = await fetch(`https://registry.npmjs.org/${pkg}/latest`);
            const version = JSON.parse(res).version;

            return [pkg, '^' + version];
        });
}

async function main() {
    fs.existsSync('package.json') || die('package.json not found!');

    const contents = await fs.promises.readFile('package.json', 'utf8');
    const pkg = JSON.parse(contents);

    const dependencies = await Promise.all(getLatestVersions(pkg.dependencies));
    const devDependencies = await Promise.all(getLatestVersions(pkg.devDependencies));

    const updated = {
        ... pkg,
        dependencies: Object.fromEntries(dependencies),
        devDependencies: Object.fromEntries(devDependencies)
    };

    if (process.argv.includes('--force-save')) {
        fs.writeFileSync('package.json', JSON.stringify(updated, null, 2) + '\n');
    } else {
        console.log(JSON.stringify(updated, null, 2));
    }
}

main();
