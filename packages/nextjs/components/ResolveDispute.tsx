import { useState } from "react";
import { useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

export default function ResolveDispute() {
  const [dealId, setDealId] = useState(""); // ID сделки и выбора результата
  const [releaseToSeller, setReleaseToSeller] = useState(true); // Результат (продавцу или покупателю)

  // Хук для работы со смарт-контрактом DealContract
  const { writeContractAsync } = useScaffoldWriteContract("DealContract");

  // Обработчик для разрешения спора
  const handleResolve = async () => {
    if (!dealId) {
      alert("Укажите ID сделки."); // Проверка на заполнение ID
      return;
    }

    try {
      // Вызов функции контракта с аргументами
      await writeContractAsync({
        functionName: "resolveDispute", // Имя функции в контракте
        args: [BigInt(dealId), releaseToSeller],
      });
      alert("Спор успешно разрешён!"); // Уведомление об успехе
    } catch (err) {
      console.error(err);
      alert("Ошибка при разрешении спора."); // Уведомление об ошибке
    }
  };

  return (
    <div>
      <h3>Разрешение спора</h3>
      <input
        type="number"
        placeholder="ID сделки"
        value={dealId}
        onChange={e => setDealId(e.target.value)} // Обновление состояния ID сделки
      />
      <select
        value={Number(releaseToSeller)}
        onChange={e => setReleaseToSeller(e.target.value === "true")} // Обновление результата (продавцу/покупателю)
      >
        <option value="true">Перевести продавцу</option>
        <option value="false">Вернуть покупателю</option>
      </select>
      <button onClick={handleResolve}>{"Разрешить спор"}</button>
    </div>
  );
}
