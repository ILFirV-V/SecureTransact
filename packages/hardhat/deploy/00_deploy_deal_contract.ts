import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";

// Определяем функцию деплоя контракта
const deployCopyrightRegistry: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  // Получаем объекты 'deployments' и 'getNamedAccounts' из среды выполнения
  const { deployments, getNamedAccounts } = hre;
  const { deploy } = deployments; // Получаем метод 'deploy' для деплоя контракта

  // Получаем аккаунты, используемые для деплоя
  const { deployer } = await getNamedAccounts();

  // Разворачиваем контракт "DealContract" от имени деплойера
  await deploy("DealContract", {
    from: deployer, // Указываем адрес деплойера
    log: true, // Включаем логирование процесса деплоя
  });
};

// Экспортируем функцию деплоя, чтобы она могла быть использована в Hardhat
export default deployCopyrightRegistry;
