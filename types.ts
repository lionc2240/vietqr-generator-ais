
export interface Bank {
  id: number;
  name: string;
  code: string;
  bin: number;
  shortName: string;
  logo: string;
  transferSupported: number;
  lookupSupported: number;
}

export interface VietQRRequest {
  acqId: number;
  accountNo: string;
  accountName: string;
  amount?: number;
  addInfo?: string;
  template: string;
  format?: string;
}

export interface VietQRResponseData {
  qrCode: string;
  qrDataURL: string;
}

export interface VietQRResponse {
  code: string;
  desc: string;
  data: VietQRResponseData | null;
  success: boolean;
}

export interface Profile {
  profileName: string;
  acqId: number;
  accountNo: string;
  accountName: string;
}

export interface SavedMessage {
    name: string;
    template: string;
}
