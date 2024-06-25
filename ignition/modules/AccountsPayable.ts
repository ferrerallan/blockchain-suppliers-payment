import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const AccountsPayableModule = buildModule("AccountsPayableModule", (m) => {
  
  const clientAddress = "0x912643AbC9C91Fea9E1Fdf9CB7ED3763885BFAbE"; 
  
  const accountsPayable = m.contract("AccountsPayable", [clientAddress]);

  return { accountsPayable };
});

export default AccountsPayableModule;
