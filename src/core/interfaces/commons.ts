export interface SimpleBaseEntity {
  id: number;
}

export interface BaseEntity extends SimpleBaseEntity {
  createdAt?: string;
  updatedAt?: string;
}
