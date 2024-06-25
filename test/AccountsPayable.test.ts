import {
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("AccountsPayable", function () {
  async function deployFixture() {
    const [owner, client, supplier1, supplier2] = await ethers.getSigners();
    const AccountsPayable = await ethers.getContractFactory("AccountsPayable");
    const accountsPayable = await AccountsPayable.deploy(client.address);

    return { accountsPayable, owner, client, supplier1, supplier2 };
  }

  it("Should create an invoice", async function () {
    const { accountsPayable, supplier1 } = await loadFixture(deployFixture);

    await accountsPayable.connect(supplier1).createInvoice("Test Invoice", ethers.parseEther("1"), 2000000000);
    const invoice = await accountsPayable.invoices(1);
    expect(invoice.description).to.equal("Test Invoice");
    expect(invoice.amount).to.equal(ethers.parseEther("1"));
    expect(invoice.dueDate).to.equal(2000000000);
    expect(invoice.supplier).to.equal(await supplier1.getAddress());
    expect(invoice.isPaid).to.be.false;
  });

  it("Should allow the client to pay an invoice", async function () {
    const { accountsPayable, client, supplier1 } = await loadFixture(deployFixture);

    await accountsPayable.connect(supplier1).createInvoice("Test Invoice", ethers.parseEther("1"), 2000000000);
    await accountsPayable.connect(client).payInvoice(1, { value: ethers.parseEther("1") });
    const invoice = await accountsPayable.invoices(1);
    expect(invoice.isPaid).to.be.true;
    const balance = await accountsPayable.balances(await supplier1.getAddress());
    expect(balance).to.equal(ethers.parseEther("1"));
  });

  it("Should not allow non-clients to pay an invoice", async function () {
    const { accountsPayable, supplier1, supplier2 } = await loadFixture(deployFixture);

    await accountsPayable.connect(supplier1).createInvoice("Test Invoice", ethers.parseEther("1"), 2000000000);
    await expect(
      accountsPayable.connect(supplier2).payInvoice(1, { value: ethers.parseEther("1") })
    ).to.be.revertedWith("Only the client can pay invoices");
  });

  it("Should allow suppliers to withdraw funds", async function () {
    const { accountsPayable, client, supplier1 } = await loadFixture(deployFixture);

    await accountsPayable.connect(supplier1).createInvoice("Test Invoice", ethers.parseEther("1"), 2000000000);
    await accountsPayable.connect(client).payInvoice(1, { value: ethers.parseEther("1") });
    await accountsPayable.connect(supplier1).withdrawFunds();
    const balance = await accountsPayable.balances(await supplier1.getAddress());
    expect(balance).to.equal(0);
  });

  it("Should not allow suppliers to withdraw if balance is zero", async function () {
    const { accountsPayable, supplier1 } = await loadFixture(deployFixture);

    await expect(accountsPayable.connect(supplier1).withdrawFunds()).to.be.revertedWith("Insufficient balance");
  });

  it("Should return correct invoice status", async function () {
    const { accountsPayable, supplier1 } = await loadFixture(deployFixture);

    await accountsPayable.connect(supplier1).createInvoice("Test Invoice", ethers.parseEther("1"), 2000000000);
    const [isPaid, dueDate] = await accountsPayable.checkInvoiceStatus(1);
    expect(isPaid).to.be.false;
    expect(dueDate).to.equal(2000000000);
  });

  it("Should list pending invoices for a supplier", async function () {
    const { accountsPayable, supplier1 } = await loadFixture(deployFixture);

    await accountsPayable.connect(supplier1).createInvoice("Invoice 1", ethers.parseEther("1"), 2000000000);
    await accountsPayable.connect(supplier1).createInvoice("Invoice 2", ethers.parseEther("2"), 2000000000);
    const pendingInvoices = await accountsPayable.getPendingInvoices(await supplier1.getAddress());
    expect(pendingInvoices.length).to.equal(2);
    expect(pendingInvoices[0]).to.equal(1);
    expect(pendingInvoices[1]).to.equal(2);
  });
});
