import { ethers } from "hardhat";
import { expect } from "chai";
import { DealContract } from "../typechain-types";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";

describe("Deal Contract", function () {
  let dealContract: DealContract;
  let buyer: HardhatEthersSigner;
  let seller: HardhatEthersSigner;
  let arbiter: HardhatEthersSigner;

  beforeEach(async () => {
    // Получение тестовых аккаунтов
    [buyer, seller, arbiter] = await ethers.getSigners();

    // Деплой контракта
    const contractFactory = await ethers.getContractFactory("DealContract");
    dealContract = await contractFactory.deploy();
  });

  it("Создание и внесение депозита сделки", async () => {
    const depositAmount = ethers.parseEther("1");

    // Создание сделки
    await expect(
      dealContract.connect(buyer).createAndDepositDeal(seller.address, arbiter.address, {
        value: depositAmount,
      }),
    )
      .to.emit(dealContract, "DealCreated") // Проверка события
      .withArgs(1, buyer.address, seller.address, depositAmount);

    // Проверка состояния сделки
    const deal = await dealContract.deals(1);
    expect(deal.buyer).to.equal(buyer.address);
    expect(deal.seller).to.equal(seller.address);
    expect(deal.amount).to.equal(depositAmount);
  });

  it("Подтверждение сделки", async () => {
    const depositAmount = ethers.parseEther("1");

    // Создание сделки
    await dealContract.connect(buyer).createAndDepositDeal(seller.address, arbiter.address, {
      value: depositAmount,
    });

    // Подтверждение сделки
    await expect(dealContract.connect(buyer).confirmTransaction(1))
      .to.emit(dealContract, "TransactionConfirmed") // Проверка события
      .withArgs(1, seller.address);

    // Проверка баланса продавца
    // const sellerBalanceAfter = await ethers.provider.getBalance(seller.address);
    // expect(sellerBalanceAfter).to.be.above(depositAmount);
  });

  it("Инициация спора", async () => {
    const depositAmount = ethers.parseEther("1");

    // Создание сделки
    await dealContract.connect(buyer).createAndDepositDeal(seller.address, arbiter.address, {
      value: depositAmount,
    });

    // Инициация спора
    await expect(dealContract.connect(buyer).raiseDispute(1))
      .to.emit(dealContract, "DisputeRaised") // Проверка события
      .withArgs(1, buyer.address);
  });

  it("Разрешение спора в пользу продавца", async () => {
    const depositAmount = ethers.parseEther("1");

    // Создание сделки
    await dealContract.connect(buyer).createAndDepositDeal(seller.address, arbiter.address, {
      value: depositAmount,
    });

    // Инициация спора
    await dealContract.connect(buyer).raiseDispute(1);

    // Разрешение спора арбитром в пользу продавца
    await dealContract.connect(arbiter).resolveDispute(1, true);

    // Проверка баланса продавца
    const sellerBalanceAfter = await ethers.provider.getBalance(seller.address);
    expect(sellerBalanceAfter).to.be.above(depositAmount);
  });

  it("Разрешение спора в пользу покупателя", async () => {
    const depositAmount = ethers.parseEther("1");

    // Создание сделки
    await dealContract.connect(buyer).createAndDepositDeal(seller.address, arbiter.address, {
      value: depositAmount,
    });

    // Инициация спора
    await dealContract.connect(buyer).raiseDispute(1);

    // Разрешение спора арбитром в пользу покупателя
    await dealContract.connect(arbiter).resolveDispute(1, false);

    // Проверка возврата средств покупателю
    const buyerBalanceAfter = await ethers.provider.getBalance(buyer.address);
    expect(buyerBalanceAfter).to.be.above(depositAmount);
  });

  it("Попытка создания сделки с нулевым депозитом", async () => {
    // Попытка создания сделки с нулевой суммой
    await expect(
      dealContract.connect(buyer).createAndDepositDeal(seller.address, arbiter.address, {
        value: 0,
      }),
    ).to.be.revertedWith("Payment must be greater than zero");
  });
});
