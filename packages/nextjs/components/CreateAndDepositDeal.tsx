import { useState } from "react";
import { ethers } from "ethers";
import { useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

export default function CreateAndDepositDeal() {
  const [seller, setSeller] = useState(""); // Адрес продавца
  const [arbiter, setArbiter] = useState(""); // Адрес арбитра
  const [amount, setAmount] = useState(""); // Сумма депозита

  // Хук для работы со смарт-контрактом DealContract
  const { writeContractAsync } = useScaffoldWriteContract("DealContract");

  // Обработчик для создания сделки и внесения депозита
  const handleCreateDeal = async () => {
    if (!seller || !arbiter || !amount) {
      alert("Пожалуйста, заполните все поля."); // Проверка заполнения всех полей
      return;
    }

    try {
      // Вызов функции контракта с аргументами
      await writeContractAsync({
        functionName: "createAndDepositDeal", // Имя функции в контракте
        args: [seller, arbiter],
        value: ethers.parseEther(amount), // Преобразование суммы в формат ETH
      });
      alert("Сделка успешно создана и депозит внесён!"); // Уведомление об успехе
    } catch (err) {
      console.error(err);
      alert("Ошибка при создании сделки."); // Уведомление об ошибке
    }
  };

  return (
    <div>
      <h3>Создание и депозит сделки</h3>
      <input
        type="text"
        placeholder="Адрес продавца"
        value={seller}
        onChange={e => setSeller(e.target.value)} // Обновление состояния адреса продавца
      />
      <input
        type="text"
        placeholder="Адрес арбитра"
        value={arbiter}
        onChange={e => setArbiter(e.target.value)} // Обновление состояния адреса арбитра
      />
      <input
        type="number"
        placeholder="Сумма (ETH)"
        value={amount}
        onChange={e => setAmount(e.target.value)} // Обновление суммы депозита
      />
      <button onClick={handleCreateDeal}>{"Создать и внести депозит"}</button>
    </div>
  );
}
