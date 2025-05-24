/**
 * This file was @generated using pocketbase-typegen
 */

import type PocketBase from 'pocketbase';
import type { RecordService } from 'pocketbase';

export enum Collections {
  Authorigins = '_authOrigins',
  Externalauths = '_externalAuths',
  Mfas = '_mfas',
  Otps = '_otps',
  Superusers = '_superusers',
  Buttons = 'buttons',
  Cities = 'cities',
  FieldSizes = 'field_sizes',
  Fields = 'fields',
  OrderItem = 'order_item',
  Orders = 'orders',
  Regions = 'regions',
  StadiumFeatures = 'stadium_features',
  StadiumRates = 'stadium_rates',
  Stadiums = 'stadiums',
  Translations = 'translations',
  UserFavoriteStadiums = 'user_favorite_stadiums',
  Users = 'users'
}

// Alias types for improved usability
export type IsoDateString = string;
export type RecordIdString = string;
export type HTMLString = string;

export type GeoPoint = {
  lon: number;
  lat: number;
};

type ExpandType<T> = unknown extends T
  ? T extends unknown
    ? { expand?: unknown }
    : { expand: T }
  : { expand: T };

// System fields
export type BaseSystemFields<T = unknown> = {
  id: RecordIdString;
  collectionId: string;
  collectionName: Collections;
} & ExpandType<T>;

export type AuthSystemFields<T = unknown> = {
  email: string;
  emailVisibility: boolean;
  username: string;
  verified: boolean;
} & BaseSystemFields<T>;

// Record types for each collection

export type AuthoriginsRecord = {
  collectionRef: string;
  created?: IsoDateString;
  fingerprint: string;
  id: string;
  recordRef: string;
  updated?: IsoDateString;
};

export type ExternalauthsRecord = {
  collectionRef: string;
  created?: IsoDateString;
  id: string;
  provider: string;
  providerId: string;
  recordRef: string;
  updated?: IsoDateString;
};

export type MfasRecord = {
  collectionRef: string;
  created?: IsoDateString;
  id: string;
  method: string;
  recordRef: string;
  updated?: IsoDateString;
};

export type OtpsRecord = {
  collectionRef: string;
  created?: IsoDateString;
  id: string;
  password: string;
  recordRef: string;
  sentTo?: string;
  updated?: IsoDateString;
};

export type SuperusersRecord = {
  created?: IsoDateString;
  email: string;
  emailVisibility?: boolean;
  id: string;
  password: string;
  tokenKey: string;
  updated?: IsoDateString;
  verified?: boolean;
};

export type ButtonsRecord = {
  created?: IsoDateString;
  english?: string;
  id: string;
  name?: string;
  russian?: string;
  updated?: IsoDateString;
  uzbek?: string;
};

export type CitiesRecord = {
  created?: IsoDateString;
  id: string;
  name?: RecordIdString;
  updated?: IsoDateString;
};

export type FieldSizesRecord = {
  created?: IsoDateString;
  id: string;
  name?: string;
  updated?: IsoDateString;
};

export enum FieldsTypeOptions {
  'grass' = 'grass',
  'futsal' = 'futsal'
}

export enum FieldsStatusOptions {
  'suspended' = 'suspended',
  'active' = 'active'
}
export type FieldsRecord = {
  created?: IsoDateString;
  fid?: number;
  id: string;
  images?: string[];
  price?: number;
  size?: RecordIdString;
  stadium?: RecordIdString;
  status?: FieldsStatusOptions;
  type?: FieldsTypeOptions;
  updated?: IsoDateString;
};

export type OrderItemRecord = {
  created?: IsoDateString;
  id: string;
  order?: RecordIdString;
  time_from?: number;
  updated?: IsoDateString;
};

export enum OrdersTypeOptions {
  'order' = 'order',
  'reserve' = 'reserve'
}
export type OrdersRecord = {
  created?: IsoDateString;
  date?: IsoDateString;
  field?: RecordIdString;
  id: string;
  totalPrice?: number;
  totalTime?: number;
  type?: OrdersTypeOptions;
  updated?: IsoDateString;
  user?: RecordIdString;
};

export type RegionsRecord = {
  created?: IsoDateString;
  id: string;
  name?: RecordIdString;
  updated?: IsoDateString;
};

export type StadiumFeaturesRecord = {
  created?: IsoDateString;
  id: string;
  name?: RecordIdString;
  updated?: IsoDateString;
};

export type StadiumRatesRecord = {
  comment?: HTMLString;
  created?: IsoDateString;
  id: string;
  score?: number;
  stadium?: RecordIdString;
  updated?: IsoDateString;
  user?: RecordIdString;
};

export enum StadiumsStatusOptions {
  'verified' = 'verified',
  'new' = 'new'
}
export type StadiumsRecord<Tsocials = unknown> = {
  address?: string;
  city?: RecordIdString;
  created?: IsoDateString;
  features?: RecordIdString;
  id: string;
  image?: string[];
  isSaved?: boolean;
  longlat?: GeoPoint;
  name?: string;
  ratesCount?: number;
  rules?: string;
  savedId?: string;
  score?: number;
  socials?: null | Tsocials;
  status?: StadiumsStatusOptions;
  updated?: IsoDateString;
  worktime_from?: number;
  worktime_to?: number;
};

export type TranslationsRecord = {
  created?: IsoDateString;
  english?: string;
  id: string;
  key?: string;
  russian?: string;
  updated?: IsoDateString;
  uzbek?: string;
};

export type UserFavoriteStadiumsRecord = {
  created?: IsoDateString;
  id: string;
  stadium?: RecordIdString;
  updated?: IsoDateString;
  user?: RecordIdString;
};

export enum UsersRoleOptions {
  'admin' = 'admin',
  'manager' = 'manager'
}

export enum UsersLanguageOptions {
  'russian' = 'russian',
  'english' = 'english',
  'uzbek' = 'uzbek'
}
export type UsersRecord = {
  avatar?: string;
  birthDate?: IsoDateString;
  bornCity?: RecordIdString;
  created?: IsoDateString;
  email: string;
  emailVisibility?: boolean;
  fullname?: string;
  id: string;
  language?: UsersLanguageOptions;
  liveCity?: RecordIdString;
  password: string;
  phoneNumber?: string;
  role?: UsersRoleOptions;
  tokenKey: string;
  updated?: IsoDateString;
  verified?: boolean;
};

// Response types include system fields and match responses from the PocketBase API
export type AuthoriginsResponse<Texpand = unknown> =
  Required<AuthoriginsRecord> & BaseSystemFields<Texpand>;
export type ExternalauthsResponse<Texpand = unknown> =
  Required<ExternalauthsRecord> & BaseSystemFields<Texpand>;
export type MfasResponse<Texpand = unknown> = Required<MfasRecord> &
  BaseSystemFields<Texpand>;
export type OtpsResponse<Texpand = unknown> = Required<OtpsRecord> &
  BaseSystemFields<Texpand>;
export type SuperusersResponse<Texpand = unknown> = Required<SuperusersRecord> &
  AuthSystemFields<Texpand>;
export type ButtonsResponse<Texpand = unknown> = Required<ButtonsRecord> &
  BaseSystemFields<Texpand>;
export type CitiesResponse<Texpand = unknown> = Required<CitiesRecord> &
  BaseSystemFields<Texpand>;
export type FieldSizesResponse<Texpand = unknown> = Required<FieldSizesRecord> &
  BaseSystemFields<Texpand>;
export type FieldsResponse<Texpand = unknown> = Required<FieldsRecord> &
  BaseSystemFields<Texpand>;
export type OrderItemResponse<Texpand = unknown> = Required<OrderItemRecord> &
  BaseSystemFields<Texpand>;
export type OrdersResponse<Texpand = unknown> = Required<OrdersRecord> &
  BaseSystemFields<Texpand>;
export type RegionsResponse<Texpand = unknown> = Required<RegionsRecord> &
  BaseSystemFields<Texpand>;
export type StadiumFeaturesResponse<Texpand = unknown> =
  Required<StadiumFeaturesRecord> & BaseSystemFields<Texpand>;
export type StadiumRatesResponse<Texpand = unknown> =
  Required<StadiumRatesRecord> & BaseSystemFields<Texpand>;
export type StadiumsResponse<Tsocials = unknown, Texpand = unknown> = Required<
  StadiumsRecord<Tsocials>
> &
  BaseSystemFields<Texpand>;
export type TranslationsResponse<Texpand = unknown> =
  Required<TranslationsRecord> & BaseSystemFields<Texpand>;
export type UserFavoriteStadiumsResponse<Texpand = unknown> =
  Required<UserFavoriteStadiumsRecord> & BaseSystemFields<Texpand>;
export type UsersResponse<Texpand = unknown> = Required<UsersRecord> &
  AuthSystemFields<Texpand>;

// Types containing all Records and Responses, useful for creating typing helper functions

export type CollectionRecords = {
  _authOrigins: AuthoriginsRecord;
  _externalAuths: ExternalauthsRecord;
  _mfas: MfasRecord;
  _otps: OtpsRecord;
  _superusers: SuperusersRecord;
  buttons: ButtonsRecord;
  cities: CitiesRecord;
  field_sizes: FieldSizesRecord;
  fields: FieldsRecord;
  order_item: OrderItemRecord;
  orders: OrdersRecord;
  regions: RegionsRecord;
  stadium_features: StadiumFeaturesRecord;
  stadium_rates: StadiumRatesRecord;
  stadiums: StadiumsRecord;
  translations: TranslationsRecord;
  user_favorite_stadiums: UserFavoriteStadiumsRecord;
  users: UsersRecord;
};

export type CollectionResponses = {
  _authOrigins: AuthoriginsResponse;
  _externalAuths: ExternalauthsResponse;
  _mfas: MfasResponse;
  _otps: OtpsResponse;
  _superusers: SuperusersResponse;
  buttons: ButtonsResponse;
  cities: CitiesResponse;
  field_sizes: FieldSizesResponse;
  fields: FieldsResponse;
  order_item: OrderItemResponse;
  orders: OrdersResponse;
  regions: RegionsResponse;
  stadium_features: StadiumFeaturesResponse;
  stadium_rates: StadiumRatesResponse;
  stadiums: StadiumsResponse;
  translations: TranslationsResponse;
  user_favorite_stadiums: UserFavoriteStadiumsResponse;
  users: UsersResponse;
};

// Type for usage with type asserted PocketBase instance
// https://github.com/pocketbase/js-sdk#specify-typescript-definitions

export type TypedPocketBase = PocketBase & {
  collection(idOrName: '_authOrigins'): RecordService<AuthoriginsResponse>;
  collection(idOrName: '_externalAuths'): RecordService<ExternalauthsResponse>;
  collection(idOrName: '_mfas'): RecordService<MfasResponse>;
  collection(idOrName: '_otps'): RecordService<OtpsResponse>;
  collection(idOrName: '_superusers'): RecordService<SuperusersResponse>;
  collection(idOrName: 'buttons'): RecordService<ButtonsResponse>;
  collection(idOrName: 'cities'): RecordService<CitiesResponse>;
  collection(idOrName: 'field_sizes'): RecordService<FieldSizesResponse>;
  collection(idOrName: 'fields'): RecordService<FieldsResponse>;
  collection(idOrName: 'order_item'): RecordService<OrderItemResponse>;
  collection(idOrName: 'orders'): RecordService<OrdersResponse>;
  collection(idOrName: 'regions'): RecordService<RegionsResponse>;
  collection(
    idOrName: 'stadium_features'
  ): RecordService<StadiumFeaturesResponse>;
  collection(idOrName: 'stadium_rates'): RecordService<StadiumRatesResponse>;
  collection(idOrName: 'stadiums'): RecordService<StadiumsResponse>;
  collection(idOrName: 'translations'): RecordService<TranslationsResponse>;
  collection(
    idOrName: 'user_favorite_stadiums'
  ): RecordService<UserFavoriteStadiumsResponse>;
  collection(idOrName: 'users'): RecordService<UsersResponse>;
};
