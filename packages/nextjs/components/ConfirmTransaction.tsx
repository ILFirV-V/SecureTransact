import { useState } from "react";
import { useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

export default function ConfirmTransaction() {
  // Локальное состояние для ID сделки
  const [dealId, setDealId] = useState("");

  // Хук для работы со смарт-контрактом DealContract
  const { writeContractAsync } = useScaffoldWriteContract("DealContract");

  // Обработчик для подтверждения сделки
  const handleConfirm = async () => {
    if (!dealId) {
      alert("Укажите ID сделки."); // Проверка на заполнение ID
      return;
    }

    try {
      // Вызов функции контракта с аргументами
      await writeContractAsync({
        functionName: "confirmTransaction", // Имя функции в контракте
        args: [BigInt(dealId)],
      });
      alert("Сделка успешно подтверждена!"); // Уведомление об успехе
    } catch (err) {
      console.error(err);
      alert("Ошибка при подтверждении сделки."); // Уведомление об ошибке
    }
  };

  return (
    <div>
      <h3>Подтверждение сделки</h3>
      <input
        type="number"
        placeholder="ID сделки"
        value={dealId}
        onChange={e => setDealId(e.target.value)} // Обновление состояния ID сделки
      />
      <button onClick={handleConfirm}>{"Подтвердить сделку"}</button>
    </div>
  );
}
