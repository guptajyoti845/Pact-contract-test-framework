const path = require("path");
const chai = require("chai");
const { Pact, Matchers } = require("@pact-foundation/pact");
const chaiAsPromised = require("chai-as-promised");
const expect = chai.expect;
chai.use(chaiAsPromised);
const { string } = Matchers;
const get = require('../src/get');

describe('Consumer Test', () => {
    const provider = new Pact({
        consumer: "React",
        provider: "token",
        port: 1234,
        log: path.resolve(process.cwd(), 'logs', 'pact.log'),
        dir: path.resolve(process.cwd(), 'pacts'),
        logLevel: "INFO"
    });

    before(() => provider.setup())

    describe('valid token', () => {
        before(done => { provider.addInteraction({
            state: "user token",
            uponReceiving: "GET user token",
            withRequest: {
                method: "GET",
                path: "/token/1234",
                headers: { Accept: "application/json, text/plain, */*" }
            },
            willRespondWith: {
                headers: { "Content-Type": "application/json" },
                status: 200,
                body: { "token": string("bearer") }
            }
        }).then(() => {
            done()
        })
        })

        it('OK response', () => {
            get()
                .then((response) => {
                    expect(response.status).to.be.equal(200)
                })
        })

    })

    describe('invalid token', () => {
        before(done => {
            provider.addInteraction({
                state: "user token",
                uponReceiving: "GET invalid user token",
                withRequest: {
                    method: "GET",
                    path: "/token/null",
                    headers: { Accept: "application/json, text/plain, */*" }
                },
                willRespondWith: {
                    headers: { "Content-Type": "application/json" },
                    status: 400,
                    body: { "error": "token must be a string" }
                }
            }).then(() => {
                done()
            })
        })

        it('BAD response', () => {
            getNull()
                .then((response) => {
                    expect(response.status).to.be.equal(400)
                })
        })
    })

    afterEach(() => provider.verify())

    after(() => provider.finalize())
})
