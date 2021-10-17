import {IsNull, MigrationInterface, QueryRunner, TableColumn, TableForeignKey} from "typeorm";

export class AlterTableStatement1634411735145 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn("statements", new TableColumn({
      name: "send_id",
      type: "uuid",
      isNullable: true,
    }));

    await queryRunner.createForeignKey("statements", new TableForeignKey({
      name: 'FKSendUserUsers',
      referencedTableName: 'users',
      referencedColumnNames: ['id'],
      columnNames: ['send_id'],
      onUpdate: 'SET NULL',
      onDelete: 'SET NULL'
    }));

  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey("statements", "FKSendUserUsers");
    await queryRunner.dropColumn("statements", "send_id");
  }

}
