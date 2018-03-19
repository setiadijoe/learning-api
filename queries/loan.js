module.exports.fetchLoanById = (accountId) => ({
  name: 'fetch-loanId',
  text: `
  SELECT 
    "Accounts".id, 
    "Accounts".source, 
    "Accounts".source_id, 
    "LoanAccounts".loan_id
  FROM 
    "Accounts"
  INNER JOIN
    "LoanAccounts" 
    ON
    "LoanAccounts"."id" = "Accounts".source_id
  WHERE 
    "Accounts".id = $1 
    AND 
    "Accounts".source = 'LoanAccount'
  `,
  values: [accountId]
})
