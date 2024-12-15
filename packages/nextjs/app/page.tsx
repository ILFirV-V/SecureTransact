"use client";

import ConfirmTransaction from "../components/ConfirmTransaction";
import CreateAndDepositDeal from "../components/CreateAndDepositDeal";
import RaiseDispute from "../components/RaiseDispute";
import ResolveDispute from "../components/ResolveDispute";

export default function Home() {
  return (
    <div>
      <h1>User Interface for the testing Deal Contract</h1>
      <CreateAndDepositDeal /> {/* Компонент для создания и депозита сделки */}
      <ConfirmTransaction /> {/* Компонент для подтверждения сделки */}
      <RaiseDispute /> {/* Компонент для инициирования спора */}
      <ResolveDispute /> {/* Компонент для разрешения спора */}
    </div>
  );
}
