import { useState } from "react";
import { useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

export default function RaiseDispute() {
  // Локальное состояние для ID сделки
  const [dealId, setDealId] = useState("");

  // Хук для работы со смарт-контрактом DealContract
  const { writeContractAsync } = useScaffoldWriteContract("DealContract");

  // Обработчик для инициирования спора
  const handleRaiseDispute = async () => {
    if (!dealId) {
      alert("Укажите ID сделки."); // Проверка на заполнение ID
      return;
    }

    try {
      // Вызов функции контракта с аргументами
      await writeContractAsync({
        functionName: "raiseDispute", // Имя функции в контракте
        args: [BigInt(dealId)],
      });
      alert("Спор успешно инициирован!"); // Уведомление об успехе
    } catch (err) {
      console.error(err);
      alert("Ошибка при инициировании спора."); // Уведомление об ошибке
    }
  };

  return (
    <div>
      <h3>Инициация спора</h3>
      <input
        type="number"
        placeholder="ID сделки"
        value={dealId}
        onChange={e => setDealId(e.target.value)} // Обновление состояния ID сделки
      />
      <button onClick={handleRaiseDispute}>
        {"Инициировать спор"} {/* Указание состояния загрузки */}
      </button>
    </div>
  );
}
