import {
  DataTypes,
  Model,
  Optional,
} from "sequelize";

import { sequelize } from "../database/sequelize";

interface ClienteAttributes {
  identificacion: string;
  nombres: string;
  apellidos: string;
  tipoIdentificacion: string;
  fechaNacimiento: string;
  numeroCelular: string;
  correoElectronico: string;
}

interface ServicioAttributes {
  identificacion: string;
  servicio: string;
  fechaInicio: string;
  ultimaFacturacion: string;
  ultimoPago: number;
}

type ClienteCreationAttributes = ClienteAttributes;
type ServicioCreationAttributes = Optional<ServicioAttributes, "ultimoPago">;

export class Cliente
  extends Model<ClienteAttributes, ClienteCreationAttributes>
  implements ClienteAttributes
{
  declare identificacion: string;
  declare nombres: string;
  declare apellidos: string;
  declare tipoIdentificacion: string;
  declare fechaNacimiento: string;
  declare numeroCelular: string;
  declare correoElectronico: string;
  declare servicios?: Servicio[];
}

export class Servicio
  extends Model<ServicioAttributes, ServicioCreationAttributes>
  implements ServicioAttributes
{
  declare identificacion: string;
  declare servicio: string;
  declare fechaInicio: string;
  declare ultimaFacturacion: string;
  declare ultimoPago: number;
}

Cliente.init(
  {
    identificacion: {
      type: DataTypes.STRING(20),
      primaryKey: true,
      allowNull: false,
    },
    nombres: {
      type: DataTypes.STRING(80),
      allowNull: false,
    },
    apellidos: {
      type: DataTypes.STRING(80),
      allowNull: false,
    },
    tipoIdentificacion: {
      type: DataTypes.STRING(2),
      allowNull: false,
    },
    fechaNacimiento: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    numeroCelular: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    correoElectronico: {
      type: DataTypes.STRING(80),
      allowNull: false,
      unique: true,
      validate: { isEmail: true },
    },
  },
  {
    sequelize,
    tableName: "clientes",
    timestamps: false,
  },
);

Servicio.init(
  {
    identificacion: {
      type: DataTypes.STRING(20),
      primaryKey: true,
      allowNull: false,
      references: {
        model: Cliente,
        key: "identificacion",
      },
      onUpdate: "CASCADE",
      onDelete: "NO ACTION",
    },
    servicio: {
      type: DataTypes.STRING(80),
      primaryKey: true,
      allowNull: false,
    },
    fechaInicio: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    ultimaFacturacion: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    ultimoPago: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
  },
  {
    sequelize,
    tableName: "servicios",
    timestamps: false,
  },
);

Cliente.hasMany(Servicio, {
  as: "servicios",
  foreignKey: "identificacion",
  sourceKey: "identificacion",
});

Servicio.belongsTo(Cliente, {
  as: "cliente",
  foreignKey: "identificacion",
  targetKey: "identificacion",
});

export type ClienteInstance = InstanceType<typeof Cliente>;
export type ServicioInstance = InstanceType<typeof Servicio>;
export type { ClienteCreationAttributes, ServicioCreationAttributes };
