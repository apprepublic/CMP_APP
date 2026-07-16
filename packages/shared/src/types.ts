export type UserType = 'student' | 'tutor' | 'admin'
export type KycStatus = 'none' | 'pending' | 'verified' | 'rejected'
export type BookingStatus = 'pending' | 'pending_payment' | 'pending_approval' | 'confirmed' | 'completed' | 'cancelled'
export type SessionStatus = 'scheduled' | 'completed' | 'cancelled'
export type WalletTxType = 'deposit' | 'payment' | 'withdrawal' | 'refund' | 'earning'
export type WalletTxStatus = 'pending' | 'completed' | 'failed'
export type CredentialStatus = 'pending' | 'submitted' | 'verified' | 'rejected'
export type UpgradeStatus = 'pending' | 'approved' | 'rejected'
export type AdminRole = 'superadmin' | 'admin'
export type TutorStatus = 'active' | 'busy'

export interface Profile {
  id: string
  first_name: string | null
  last_name: string | null
  email: string | null
  avatar_url: string | null
  phone: string | null
  user_type: UserType
  country: string | null
  region: string | null
  gender: string | null
  kyc_status: KycStatus
  kyc_verified_at: string | null
  referral_code: string | null
  is_seed: boolean | null
  created_at: string | null
  updated_at: string | null
}

export interface TutorProfile {
  id: string
  bio: string | null
  subjects: string[] | null
  hourly_rate: number | null
  currency: string | null
  experience_years: number | null
  education: string | null
  teaching_style: string | null
  city: string | null
  country: string | null
  region: string | null
  status: TutorStatus
  rating: number | null
  review_count: number | null
  is_verified: boolean | null
  credentials_status: string | null
  session_type: string | null
  suspended_at: string | null
  created_at: string | null
  updated_at: string | null
}

export interface Booking {
  id: string
  tutor_id: string
  student_id: string
  subject: string
  start_date: string
  end_date: string | null
  duration_months: number | null
  contacts_per_week: number | null
  selected_days: string[] | null
  hours_per_contact: number | null
  contact_time: string | null
  hourly_rate: number | null
  currency: string | null
  total_price: number | null
  session_type: string | null
  location: string | null
  notes: string | null
  status: BookingStatus
  created_at: string | null
  updated_at: string | null
}

export interface Session {
  id: string
  booking_id: string | null
  tutor_id: string
  student_id: string
  subject: string
  session_date: string
  start_time: string
  end_time: string
  duration: number | null
  status: SessionStatus
  session_type: string | null
  location: string | null
  notes: string | null
  materials: string[] | null
  price: number | null
  currency: string | null
  student_completed: boolean | null
  tutor_completed: boolean | null
  completed_at: string | null
  created_at: string | null
  updated_at: string | null
}

export interface WalletTransaction {
  id: string
  user_id: string
  type: WalletTxType
  amount: number
  currency: string | null
  description: string | null
  session_id: string | null
  status: WalletTxStatus
  reference: string | null
  transfer_code: string | null
  created_at: string | null
}

export interface TutorCredential {
  id: string
  user_id: string
  highest_qualification: string | null
  university: string | null
  graduation_year: string | null
  credential_type: string | null
  credential_name: string | null
  institution: string | null
  file_url: string | null
  file_name: string | null
  status: CredentialStatus
  submitted_at: string | null
  reviewed_at: string | null
  reviewer_notes: string | null
  created_at: string | null
  updated_at: string | null
}

export interface KycVerification {
  id: string
  user_id: string
  id_type: string | null
  id_number: string | null
  id_document_url: string | null
  face_photo_url: string | null
  face_embedding: unknown | null
  face_confidence: number | null
  duplicate_of_user_id: string | null
  status: string
  rejection_reason: string | null
  reviewed_at: string | null
  reviewed_by: string | null
  created_at: string | null
  updated_at: string | null
}

export interface TutorUpgradeRequest {
  id: string
  user_id: string
  bio: string | null
  education: string | null
  experience_years: number | null
  subjects: string[] | null
  hourly_rate: number | null
  currency: string | null
  teaching_style: string | null
  country: string | null
  region: string | null
  city: string | null
  status: UpgradeStatus
  reviewed_at: string | null
  reviewer_notes: string | null
  submitted_at: string | null
}

export interface Payment {
  id: string
  booking_id: string | null
  student_id: string
  tutor_id: string | null
  amount: number
  currency: string | null
  platform_fee: number | null
  tutor_amount: number | null
  paystack_reference: string | null
  paystack_access_code: string | null
  paystack_status: string | null
  status: string
  metadata: unknown | null
  created_at: string | null
  updated_at: string | null
}

export interface ContactMessage {
  id: string
  name: string
  email: string
  subject: string | null
  message: string
  read: boolean | null
  created_at: string | null
}

export interface AdminUser {
  id: string
  auth_uid: string
  email: string
  full_name: string | null
  role: AdminRole
  is_active: boolean
  last_login: string | null
  created_at: string
}

export interface AdminAuditLog {
  id: string
  admin_id: string | null
  action: string
  target_table: string | null
  target_id: string | null
  old_value: unknown | null
  new_value: unknown | null
  ip_address: string | null
  created_at: string
}

export interface AdminConfig {
  key: string
  value: unknown
  description: string | null
  updated_by: string | null
  updated_at: string
}
