# utanglist

a [Sails](http://sailsjs.org) application

Endpoints:

Debt
    post /debt
      total_debt
      current_debt
      lender_id
      borrower_id
      notes
    get /debt/:id
    get /debt/lend
      token
    get /debt/borrow
      token
    patch /debt/:id/pay_off

DebtDemand
    get /debt/:id
    post /debtdemand
      total_debt
      lender_id
      borrower_id
      notes
    patch /debt/:id/approve

Payment
    post /payment
      debt
      amount
    get /payment/:id
    patch /payment/:id/approve
    patch /payment/:id/reject

