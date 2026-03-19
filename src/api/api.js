import { BASE_URL } from "./config";

// profile endpoints    
export const createProfile = `${BASE_URL}/create-profile`;
export const getProfile = `${BASE_URL}/get-profile`;
export const updateProfile = `${BASE_URL}/update-profile`;
export const deleteProfile = `${BASE_URL}/delete-profile`;
  
// membership endpoints
export const getMembershipPlans = `${BASE_URL}/get-membership-plan`;
export const purchaseMembership = `${BASE_URL}/purchase-membership`;
export const getPaymentModes = `${BASE_URL}/get-mayment-mode`;

// student endpoints
export const studentAddmission = `${BASE_URL}/student-addmission`;
export const coursePlanList = `${BASE_URL}/course-plan-list`;

// slider endpoints
export const getSliders = `${BASE_URL}/get-slider-image`;

// slot booking endpoints
export const getCourtList = `${BASE_URL}/get-court-list`;
export const getTimeSlot = `${BASE_URL}/get-time-slot`;
// auth endpoints
export const login = `${BASE_URL}/login`;
// badminton slot booking endpoints
export const badmintonSlotBooking = `${BASE_URL}/badminton-slot-booking`;
// user info endpoints
export const getUserInfo = `${BASE_URL}/get-user-info`;

 export const membershipPlanOfferList = `${BASE_URL}/membership-plan-offer-list`;


// logout endpoint
export const logoutEndpoint = `${BASE_URL}/logout`;

export const membershipHistory = `${BASE_URL}/membership-history`;

export const trainingRegistrationList = `${BASE_URL}/training-registration-list`;

export const badmintonBookingHistory = `${BASE_URL}/badminton-booking-history`;

export const sendOtp = `${BASE_URL}/send-verification-mail`;


export const createOrder = `${BASE_URL}/orders`;
