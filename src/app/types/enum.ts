  export enum GENDER {
    MALE = 'MALE',
    FEMALE = 'FEMALE',
  }
  
  export enum ROLE {
    ADMIN = 'ADMIN',
    HR = 'HR',
    MANAGER = 'MANAGER',
    WORKER = 'WORKER',
    GENERAL_MANAGER = 'GENERAL_MANAGER',
  }
  
  export enum STATUS_ACCOUNT {
    INACTIVATE = "INACTIVATE",
    ACTIVATE = "ACTIVATE"
  }
  
  export enum TYPE_CLIENT {
    COMPANY = 'COMPANY',
    INDIVIDUAL = 'INDIVIDUAL',
    GOVERNMENT = 'GOVERNMENT',
    PRIVATE_ENTERPRISE = 'PRIVATE_ENTERPRISE'
  }
  
  export enum CLIENT_STATUS {
    INACTIVATE = "INACTIVATE",
    ACTIVATE = "ACTIVATE"
  }
  
  export enum PROJECT_STATUS {
    PREPARING='PREPARING',
    GROUNDBREAKING = 'GROUNDBREAKING',
    UNDER_CONSTRUCTION = 'UNDER_CONSTRUCTION',
    COMPLETED = 'COMPLETED',
    CLOSED = 'CLOSED',
    CANCELED = 'CANCELED',
    ON_HOLD = 'ON_HOLD',
  }
  
  export enum ACTION_FORM {
    CREATE,
    UPDATE,
  }
  
  export enum MODE_FORM {
    VIEW = 'Xem',
    UPDATE = 'Chỉnh sửa',
  }
  
  export enum MODE_MEMBERS {
    ALL = 'Tất cả',
    TEAM = 'Đội'
  }
  
  export enum MODE_LEAVE_REQUEST_LETTER {
    ALL = 'Tất cả',
    MINE = 'Của tôi',
    TO_ME = 'Gửi đến tôi'
  }
  
  export enum MODE_ROOM_MEMBERS {
    DIRECT = 'trực tiếp',
    GROUP = 'nhóm'
  }
  
  export enum TASK_STATUS {
    PENDING='PENDING',
    ON_GOING='ON_GOING',
    COMPLETED='COMPLETED',
    CANCELLED='CANCELLED',
  }
  
  export enum MEMBER_PROJECT_STATUS {
    ACTIVE = 'ACTIVE',
    DEPARTED = 'DEPARTED'
  }
  
  export enum MEMBER_TEAM_STATUS {
    ACTIVATE = 'ACTIVATE',
    DEPARTED = 'DEPARTED'
  }
  
  export enum MILESTONE_STATUS {
    PENDING='PENDING',
    ON_GOING='ON_GOING',
    COMPLETED='COMPLETED',
    ON_HOLD='ON_HOLD',
    VERIFIED='VERIFIED'
  }
  
  export enum DURATION {
    CUSTOM = 'CUSTOM',
    ONE_WEEK='ONE_WEEK',
    TWO_WEEKS = 'TWO_WEEKS',
    THREE_WEEKS = 'THREE_WEEKS',
    FOUR_WEEKS = 'FOUR_WEEKS',
  }
  
  export enum ACTIVITY_TASK {
    COMMENT = 'Bình luận',
    HISTORY = 'Lịch sử'
  }
  
  export enum ATTENDANCE_STATUS {
    EARLY = 'EARLY',
    LATE = 'LATE',
    ABSENT = 'ABSENT'
  }
  
  export enum MODE_TIME {
    DATE = 'ngày',
    MONTH = 'tháng',
    YEAR = 'năm'
  }
  
  export enum STATUS_WORKING_TIME {
    INACTIVATE = "INACTIVATE",
    ACTIVATE = "ACTIVATE"
  }
  
  export enum LEAVE_REQUEST_LETTER_TYPE {
    SICK = 'SICK',
    BEREAVEMENT = 'BEREAVEMENT',
    MATERNITY = 'MATERNITY',
    PATERNITY = 'PATERNITY',
    PERSONAL = 'PERSONAL',
    MARRIAGE = 'MARRIAGE',
  }
  
  export enum LEAVE_REQUEST_LETTER_STATUS {
    PENDING = 'PENDING',
    APPROVED = 'APPROVED',
    REJECTED = 'REJECTED',
    CANCELED = 'CANCELED'
  }
  
  