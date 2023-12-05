-- Inserção de dados na tabela Currencies
INSERT INTO `db_coviver`.`Currencies` (`currency_code`, `currency_name`, `currency_symbol`) VALUES
('BRL', 'Real Brasileiro', 'R$');

-- Inserção de dados na tabela Users
INSERT INTO `db_coviver`.`Users` (`name`, `email`, `password_hash`, `google_id`) VALUES
('Raphael H. N. de Freitas', 'raphael.email@teste.com', 'kujasdunaskjcnakjsnc', NULL),
('Leticia Super Namorada', 'leticia.namorada@teste.com', 'lkasnmcancjkefasascaw', NULL);

-- Inserção de dados na tabela Account_Types
INSERT INTO `db_coviver`.`Account_Types` (`type_name`, `icon_path`) VALUES
('Carteira', 'wallet.png'),
('Itaú', 'itau.png'),
('Bradesco', 'bradesco.png'),
('Santander', 'santander.png'),
('Nubank', 'nubank.png'),
('Poupança', 'poupanca.png'),
('Investimento', 'investimento.png'),
('Noh', 'noh.png');

-- Inserção de dados na tabela Account_Categories
INSERT INTO `db_coviver`.`Account_Categories` (`category_name`) VALUES
('Conta Corrente'),
('Conta Conjunta'),
('Conta Poupança'),
('Investimento'),
('Outros');

-- Inserção de dados na tabela Accounts
INSERT INTO `db_coviver`.`Accounts` (`account_name`, `details`, `category_id`, `type_id`) VALUES
('Carteira', 'Carteira Raphael', 1, 5),
('Carteira', 'Carteira Letícia', 1, 5),
('Itaú', 'Conta corrente do Itaú', 1, 2),
('Nubank', 'Conta corrente do Nubank', 1, 5),
('Noh', 'Conta do Casal ❤️', 2, 8),
('Investimento', 'Conta de investimento do Itaú', 4, 7);

-- Inserção de dados na tabela Account_Users
INSERT INTO `db_coviver`.`Account_Users` (`account_id`, `user_id`, `default_percentage`) VALUES
(1, 1, 100),
(2, 2, 100),
(3, 1, 100),
(4, 2, 100),
(5, 1, 50),
(5, 2, 50),
(6, 1, 100);

-- Inserção de dados na tabela Transaction_Categories
INSERT INTO `db_coviver`.`Transaction_Categories` (`category_name`) VALUES
('Alimentação'),
('Educação'),
('Lazer'),
('Moradia'),
('Saúde'),
('Transporte'),
('Outros');

-- Transações recorrentes
INSERT INTO `db_coviver`.`Transactions` (`creator_user_id`, `name`, `description`, `total_amount`, `currency_id`, `account_id`, `transaction_date`, `location`, `category_id`) VALUES
(1, 'Aluguel Fevereiro', 'Pagamento do aluguel de Fevereiro', 1500.00, 1, 5, '2023-02-05 10:00:00', 'São Paulo', 4);

INSERT INTO `db_coviver`.`Transaction_Recurrences` (`transaction_id`, `frequency`, `start_date`, `day_of_month`, `status`, `last_processed_date`, `next_processing_date`) VALUES
(1, 'Monthly', '2023-02-05', 5, 'Active', '2023-02-05', '2023-03-05');

-- Transações pagas
INSERT INTO `db_coviver`.`Transactions` (`creator_user_id`, `name`, `description`, `total_amount`, `currency_id`, `account_id`, `transaction_date`, `location`, `category_id`) VALUES
(2, 'Compra Supermercado', 'Compras de Janeiro no Supermercado', 450.00, 1, 5, '2023-01-10 15:00:00', 'São Paulo', 1);

-- Transações compartilhadas
INSERT INTO `db_coviver`.`Transactions` (`creator_user_id`, `name`, `description`, `total_amount`, `currency_id`, `account_id`, `transaction_date`, `location`, `category_id`) VALUES
(1, 'Viagem a Paraty', 'Viagem de final de semana a Paraty', 2000.00, 1, 5, '2023-02-20 08:00:00', 'Paraty', 3);

INSERT INTO `db_coviver`.`Transaction_Users` (`transaction_id`, `user_id`, `contribution_percentage`) VALUES
(3, 1, 56.00),
(3, 2, 44.00);

-- Transações individuais
INSERT INTO `db_coviver`.`Transactions` (`creator_user_id`, `name`, `description`, `total_amount`, `currency_id`, `account_id`, `transaction_date`, `location`, `category_id`) VALUES
(2, 'Material de Escritório', 'Compra de materiais de escritório', 300.00, 1, 4, '2023-01-15 12:00:00', 'São Paulo', 2);

-- Transações com parcelas
INSERT INTO `db_coviver`.`Transactions` (`creator_user_id`, `name`, `description`, `total_amount`, `currency_id`, `account_id`, `transaction_date`, `location`, `category_id`) VALUES
(1, 'Curso Online', 'Inscrição em curso online de programação', 1200.00, 1, 3, '2023-01-25 10:00:00', 'Online', 2);

INSERT INTO `db_coviver`.`Transaction_Installments` (`transaction_id`, `total_installments`, `installment_amount`, `installment_number`, `due_date`, `status`) VALUES
(5, 4, 300.00, 1, '2023-01-25', 'Paid'),
(5, 4, 300.00, 2, '2023-02-25', 'Pending'),
(5, 4, 300.00, 3, '2023-03-25', 'Pending'),
(5, 4, 300.00, 4, '2023-04-25', 'Pending');