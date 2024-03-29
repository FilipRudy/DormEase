import { MigrationInterface, QueryRunner } from "typeorm";

export class Dormitory1711670429529 implements MigrationInterface {
    name = 'Dormitory1711670429529'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "Dormitories" ("uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "city" character varying NOT NULL, "street" character varying NOT NULL, "postalCode" character varying NOT NULL, CONSTRAINT "PK_7a146abbcab4a45095db0b98731" PRIMARY KEY ("uuid"))`);
        await queryRunner.query(`CREATE TABLE "Rooms" ("uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "pricePerPerson" integer NOT NULL, "size" integer NOT NULL, "dormitory_uuid" uuid NOT NULL, CONSTRAINT "PK_7364b0f5cfef49649d17fcc0003" PRIMARY KEY ("uuid"))`);
        await queryRunner.query(`CREATE TABLE "Departments" ("uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "city" character varying NOT NULL, "university" character varying NOT NULL, CONSTRAINT "PK_448dc32d514b9094211cee6952b" PRIMARY KEY ("uuid"))`);
        await queryRunner.query(`CREATE TABLE "Students" ("uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "surname" character varying NOT NULL, "social_security_number" character varying NOT NULL, "room_uuid" uuid, "department_uuid" uuid, CONSTRAINT "PK_7fcc99286ce8586e291237b1701" PRIMARY KEY ("uuid"))`);
        await queryRunner.query(`CREATE TABLE "Courses" ("uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "department_uuid" uuid NOT NULL, CONSTRAINT "PK_695bb62eaff9229841b9d5d89cd" PRIMARY KEY ("uuid"))`);
        await queryRunner.query(`CREATE TABLE "Enrollments" ("enrollmentUuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "student_uuid" uuid, "course_uuid" uuid, CONSTRAINT "PK_3a33bf1fb5909477b5468e6bee8" PRIMARY KEY ("enrollmentUuid"))`);
        await queryRunner.query(`ALTER TABLE "Rooms" ADD CONSTRAINT "FK_82f4c4bccb185606dbc544b0d48" FOREIGN KEY ("dormitory_uuid") REFERENCES "Dormitories"("uuid") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Students" ADD CONSTRAINT "FK_782fc9475f7ad25741d715af8b5" FOREIGN KEY ("room_uuid") REFERENCES "Rooms"("uuid") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Students" ADD CONSTRAINT "FK_35724d8ecd3664b7fee3f70d571" FOREIGN KEY ("department_uuid") REFERENCES "Departments"("uuid") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Courses" ADD CONSTRAINT "FK_248dc9b514fed4d444de52d0506" FOREIGN KEY ("department_uuid") REFERENCES "Departments"("uuid") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Enrollments" ADD CONSTRAINT "FK_cf52bf0db70888ced6331f35218" FOREIGN KEY ("student_uuid") REFERENCES "Students"("uuid") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Enrollments" ADD CONSTRAINT "FK_b28e622d137f48cd46119c5d6cc" FOREIGN KEY ("course_uuid") REFERENCES "Courses"("uuid") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Enrollments" DROP CONSTRAINT "FK_b28e622d137f48cd46119c5d6cc"`);
        await queryRunner.query(`ALTER TABLE "Enrollments" DROP CONSTRAINT "FK_cf52bf0db70888ced6331f35218"`);
        await queryRunner.query(`ALTER TABLE "Courses" DROP CONSTRAINT "FK_248dc9b514fed4d444de52d0506"`);
        await queryRunner.query(`ALTER TABLE "Students" DROP CONSTRAINT "FK_35724d8ecd3664b7fee3f70d571"`);
        await queryRunner.query(`ALTER TABLE "Students" DROP CONSTRAINT "FK_782fc9475f7ad25741d715af8b5"`);
        await queryRunner.query(`ALTER TABLE "Rooms" DROP CONSTRAINT "FK_82f4c4bccb185606dbc544b0d48"`);
        await queryRunner.query(`DROP TABLE "Enrollments"`);
        await queryRunner.query(`DROP TABLE "Courses"`);
        await queryRunner.query(`DROP TABLE "Students"`);
        await queryRunner.query(`DROP TABLE "Departments"`);
        await queryRunner.query(`DROP TABLE "Rooms"`);
        await queryRunner.query(`DROP TABLE "Dormitories"`);
    }

}
