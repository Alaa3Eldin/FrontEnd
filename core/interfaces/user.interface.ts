export interface IUser {
        name: string;
        email: string;
        password: string;
        role: "admin" | "user";
        addresses: IAddress[];
        phone: string;
        isDeleted: boolean;
        isActive: boolean;
}

export interface IAddress {
        label: "Home" | "Work" | "Other";
        street: string;
        city: string;
        country: string;
        postalCode: string;
        isDefault: boolean;
}