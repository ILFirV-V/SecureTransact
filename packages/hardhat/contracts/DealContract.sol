// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract DealContract {
    // Структура для хранения информации о сделке
    struct Deal {
        address buyer; // Покупатель
        address seller; // Продавец
        address arbiter; // Арбитр (третья сторона)
        uint256 amount; // Сумма сделки
        State state; // Текущее состояние сделки
    }

    // Возможные состояния сделки
    enum State { AWAITING_CONFIRMATION, COMPLETED, DISPUTED }

    // Маппинг для хранения сделок по их уникальному идентификатору
    mapping(uint256 => Deal) public deals;
    uint256 public dealCounter; // Счетчик для идентификаторов сделок

    // События
    event DealCreated(uint256 indexed dealId, address indexed buyer, address indexed seller, uint256 amount);
    event TransactionConfirmed(uint256 indexed dealId, address indexed seller);
    event DisputeRaised(uint256 indexed dealId, address indexed by);
    event FundsReleased(uint256 indexed dealId, address indexed recipient, uint256 amount);

    // Функция для создания новой сделки и внесения депозита
    function createAndDepositDeal(address _seller, address _arbiter) external payable returns (uint256) {
        require(_seller != address(0) && _arbiter != address(0), "Invalid seller or arbiter address");
        require(msg.value > 0, "Payment must be greater than zero");

        dealCounter++;
        deals[dealCounter] = Deal({
            buyer: msg.sender,
            seller: _seller,
            arbiter: _arbiter,
            amount: msg.value,
            state: State.AWAITING_CONFIRMATION
        });

        emit DealCreated(dealCounter, msg.sender, _seller, msg.value);
        return dealCounter;
    }

    // Функция для подтверждения сделки покупателем
    function confirmTransaction(uint256 dealId) external {
        Deal storage deal = deals[dealId];
        require(msg.sender == deal.buyer, "Only the buyer can confirm the transaction");
        require(deal.state == State.AWAITING_CONFIRMATION, "Invalid state for confirmation");

        deal.state = State.COMPLETED;
        payable(deal.seller).transfer(deal.amount);
        emit TransactionConfirmed(dealId, deal.seller);
        emit FundsReleased(dealId, deal.seller, deal.amount);
    }

    // Функция для инициирования спора
    function raiseDispute(uint256 dealId) external {
        Deal storage deal = deals[dealId];
        require(msg.sender == deal.buyer || msg.sender == deal.seller, "Only buyer or seller can raise a dispute");
        require(deal.state == State.AWAITING_CONFIRMATION, "Invalid state for raising a dispute");

        deal.state = State.DISPUTED;
        emit DisputeRaised(dealId, msg.sender);
    }

    // Функция для разрешения спора арбитром
    function resolveDispute(uint256 dealId, bool releaseToSeller) external {
        Deal storage deal = deals[dealId];
        require(msg.sender == deal.arbiter, "Only the arbiter can resolve disputes");
        require(deal.state == State.DISPUTED, "Invalid state for resolving a dispute");

        deal.state = State.COMPLETED;
        if (releaseToSeller) {
            payable(deal.seller).transfer(deal.amount);
            emit FundsReleased(dealId, deal.seller, deal.amount);
        } else {
            payable(deal.buyer).transfer(deal.amount);
            emit FundsReleased(dealId, deal.buyer, deal.amount);
        }
    }

    // Функция для получения информации о сделке
    function getDeal(uint256 dealId) external view returns (
        address buyer,
        address seller,
        address arbiter,
        uint256 amount,
        State state
    ) {
        Deal storage deal = deals[dealId];
        return (deal.buyer, deal.seller, deal.arbiter, deal.amount, deal.state);
    }
}
