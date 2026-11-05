export const statusLabel: Record<string, string> = {
  PENDING_REVIEW: "Në shqyrtim",
  AWAITING_INFO: "Pret të dhëna",
  AWAITING_CUSTOMER: "Pret klientin",
  CONFIRMED: "Konfirmuar",
  DECLINED: "Refuzuar",
  CANCELLED: "Anuluar",
  COMPLETED: "Kryer",
};

export const syncLabel: Record<string, string> = {
  NOT_NEEDED: "Pa bllok në kalendar",
  PENDING: "Në pritje",
  SYNCED: "Në kalendar",
  FAILED: "Dështoi",
  DRIFT: "Ndryshuar me dorë",
};

export const actionLabel: Record<string, string> = {
  submitted: "Kërkesa u dërgua",
  feasibility_confirmed: "Vendndodhja dhe shërbimi u konfirmuan",
  feasibility_unconfirmed: "Konfirmimi i vendndodhjes u hoq",
  planning_changed: "Ekipi/kohëzgjatja u ndryshua",
  approved: "Miratuar",
  revised_proposal: "U dërgua ofertë e rishikuar",
  asked_for_info: "U kërkuan të dhëna",
  customer_message: "Mesazh nga klienti",
  accepted_proposal: "Klienti e pranoi ofertën",
  declined_proposal: "Klienti nuk e pranoi ofertën",
  declined: "Refuzuar",
  cancelled: "Anuluar",
  completed: "Shënuar si i kryer",
  address_set: "Adresa u vendos",
  customer_link_rotated: "Lidhje e re për klientin",
  job_sheet_link_rotated: "Lidhje e re për fletën e punës",
  calendar_sync_failed: "Kalendari dështoi",
  calendar_drift: "Ndryshim me dorë në kalendar",
  hold_expired: "Mbajtja e datës përfundoi",
};
