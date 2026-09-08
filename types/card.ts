export type LoyaltyCard = {
  id: string;
  brandName: string;
  website: string;
  barcodeType: string;
  barcodeValue: string;
  brandPrimaryColorHex: string;
  dateAdded: string; // ISO string
  code: string;
  notes: string;
};

export type NewLoyaltyCard = Omit<LoyaltyCard, 'id' | 'dateAdded'>;
