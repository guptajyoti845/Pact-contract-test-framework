const { Publisher } = require("@pact-foundation/pact");
const opts = {
    pactFilesOrDirs: ['./pacts/'],
    pactBroker: 'http://localhost:9292',
    consumerVersion: '1.0.1',
    publishVerificationResult: true
}
new Publisher(opts)
    .publishPacts()
    .then(() => {
        console.log(" Published Successfully");
        console.log("http://localhost:9292/");
    })
    .catch((e) => {
        console.log("error"+e);
    })
