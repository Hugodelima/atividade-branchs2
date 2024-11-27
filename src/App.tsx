import { useEffect, useState } from 'react';
import * as React from 'react';

import './App.css';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';

interface Account {
  id: number | undefined;
  nameBank: string;
  agency: number;
  account: number;
  balance: number;
}

function App() {
  const [nameBank, setNameBank] = useState('');
  const [numberAgency, setNumberAgency] = useState<string>('');
  const [numberAccount, setNumberAccount] = useState<string>('');
  const [numberBalance, setNumberBalance] = useState<string>('');
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [editMode, setEditMode] = useState<{ enabled: boolean; account: Account | null }>({
    enabled: false,
    account: null,
  });

  const [open, setOpen] = React.useState(false);

  const handleClose = () => setOpen(false);

  useEffect(() => {
    const savedAccounts = localStorage.getItem('accounts');
    if (savedAccounts) {
      setAccounts(JSON.parse(savedAccounts));
    }
  }, []);

  function handleRegister() {
    if (!nameBank || !numberAgency || !numberAccount || !numberBalance) {
      alert('Por favor, preencha todos os campos solicitados');
      return;
    }

    const newAccount: Account = {
      id: editMode.enabled ? editMode.account?.id : Date.now(),
      nameBank,
      agency: Number(numberAgency),
      account: Number(numberAccount),
      balance: Number(numberBalance),
    };

    if (editMode.enabled && editMode.account) {
      handleSaveEdit(newAccount);
      return;
    }

    const updatedAccounts = [...accounts, newAccount];
    setAccounts(updatedAccounts);
    localStorage.setItem('accounts', JSON.stringify(updatedAccounts));
    resetForm();
  }

  function handleDelete(id: number | undefined) {
    if (id === undefined) return;
    const updatedAccounts = accounts.filter(account => account.id !== id);
    setAccounts(updatedAccounts);
    localStorage.setItem('accounts', JSON.stringify(updatedAccounts));
  }

  function handleEdit(account: Account) {
    setNameBank(account.nameBank);
    setNumberAgency(account.agency.toString());
    setNumberAccount(account.account.toString());
    setNumberBalance(account.balance.toString());
    setEditMode({ enabled: true, account });
  }

  function handleSaveEdit(updatedAccount: Account) {
    const updatedAccounts = accounts.map(account => 
      account.id === updatedAccount.id ? updatedAccount : account
    );
    setAccounts(updatedAccounts);
    localStorage.setItem('accounts', JSON.stringify(updatedAccounts));
    resetForm();
  }

  function resetForm() {
    setNameBank('');
    setNumberAgency('');
    setNumberAccount('');
    setNumberBalance('');
    setEditMode({ enabled: false, account: null });
  }

  function deposit(id: number | undefined, amount: number) {
    if (id === undefined) return;
    const updatedAccounts = accounts.map(account => {
      if (account.id === id) {
        account.balance += amount;
      }
      return account;
    });
    setAccounts(updatedAccounts);
    localStorage.setItem('accounts', JSON.stringify(updatedAccounts));
  }

  function withdraw(id: number | undefined, amount: number) {
    if (id === undefined) return;
    const updatedAccounts = accounts.map(account => {
      if (account.id === id) {
        if (account.balance >= amount) {
          account.balance -= amount;
        } else {
          alert('Saldo insuficiente!');
        }
      }
      return account;
    });
    setAccounts(updatedAccounts);
    localStorage.setItem('accounts', JSON.stringify(updatedAccounts));
  }

  return (
    <div>
      <h1>Gerenciamento de Conta Bancária</h1>

      <input
        type="text"
        value={nameBank}
        onChange={(e) => setNameBank(e.target.value)}
        placeholder="Nome do banco"
      />

      <input
        type="text"
        value={numberAgency}
        onChange={(e) => setNumberAgency(e.target.value)}
        placeholder="Número da Agência"
      />

      <input
        type="text"
        value={numberAccount}
        onChange={(e) => setNumberAccount(e.target.value)}
        placeholder="Número da Conta"
      />

      <input
        type="text"
        value={numberBalance}
        onChange={(e) => setNumberBalance(e.target.value)}
        placeholder="Digite o saldo"
      />

      <Button onClick={handleRegister}>
        {editMode.enabled ? 'Salvar Alterações' : 'Registrar Conta'}
      </Button>

      <hr />
      {accounts.map(account => (
        <div key={account.id}>
          <p>
            Banco: {account.nameBank}, Agência: {account.agency}, Conta: {account.account}, Saldo: {account.balance}
          </p>
          <Button onClick={() => handleEdit(account)}>Editar</Button>
          <Button onClick={() => handleDelete(account.id)}>Deletar</Button>
          <Button onClick={() => deposit(account.id, 50)}>Depositar 50</Button>
          <Button onClick={() => withdraw(account.id, 50)}>Sacar 50</Button>
        </div>
      ))}

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box className="box-modal">
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Modal Title
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            Informações do modal.
          </Typography>
        </Box>
      </Modal>
    </div>
  );
}

export default App;
