const CandyToken = artifacts.require("./CandyToken.sol");
const CandyTokenSale = artifacts.require("./CandyTokenSale.sol");
const KYC = artifacts.require("./KYC.sol");
require("dotenv").config({path: "../.env"});
const chai = require("./setupchai.js");
var chaiPromise = require("chai-as-promised");
const BN = web3.utils.BN;
const chaiBN = require("chai-bn")(BN);

chai.use(chaiBN);
chai.use(chaiPromise);

const expect = chai.expect;

contract("SaleTest", async (accounts) => {


  const [deployerAccount, recipient, anotherAccount] = accounts;

    it('should not have any tokens in my deployerAccount', async () => {
        let instance = await CandyToken.deployed();
        return expect(instance.balanceOf(deployerAccount)).to.eventually.be.a.bignumber.equal(new BN(0));
    });

    it("all tokens should be in the TokenSale Smart Contract by default", async() => {
        let instance = await CandyToken.deployed();
        let balance = await instance.balanceOf(CandyTokenSale.address);
        let totalSupply = await instance.totalSupply();
        expect(balance).to.be.a.bignumber.equal(totalSupply);
    })

    it("should accept transfers from another account", async () => {
        let tokenInstance = await CandyToken.deployed();
        let tokenSaleInstance = await CandyTokenSale.deployed();
        let kycInstance = await KYC.deployed();
        let balanceBefore = await tokenInstance.balanceOf(deployerAccount);
        await kycInstance.setKycCompleted(deployerAccount, {from: deployerAccount});
        expect(tokenSaleInstance.sendTransaction({from: deployerAccount, value: web3.utils.toWei("1", "wei")})).to.be.fulfilled;
        balanceBefore = balanceBefore.add(new BN(1));
        return expect(tokenInstance.balanceOf(deployerAccount)).to.eventually.be.a.bignumber.equal(balanceBefore);
    })
});
