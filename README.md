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

Payment

    post /payment
      debt
      amount
    post /payment/ecash_pay
      debt
      amount
      ecash_id
      ecash_pin
      device_id
      destination
      description
    get /payment/:id
    patch /payment/:id/approve
    patch /payment/:id/reject
    get /payment/ecash_balance_inquiry

DebtDemand

    post /debtdemand
      total_debt
      lender_id
      borrower_ids
      notes
    get /debtdemand/:id
    get /debtdemand/feed
    get /debtdemand/me
    patch /debtdemand/:id/request
      borrower_id
      notes
    patch /debtdemand/:id/accept
      borrower_id

DebtOffer

    post /debtoffer
      total_debt
      lender_id
      borrower_ids
      notes
    get /debtoffer/:id
    get /debtoffer/feed
    get /debtoffer/me
    patch /debtoffer/:id/request
      borrower_id
      notes
    patch /debtoffer/:id/accept
      borrower_id

