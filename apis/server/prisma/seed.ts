import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";
import { hashSalt } from "../dist/trpc/routes/users/set";

dotenv.config();

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
});

const main = async () => {
  return await prisma.$transaction(
    async (tx) => {
      await tx.address.deleteMany();
      await tx.familyDetail.deleteMany();
      await tx.leave.deleteMany();
      await tx.paySlipComponent.deleteMany();
      await tx.payRoll.deleteMany();
      await tx.visitorPass.deleteMany();
      await tx.helpDesk.deleteMany();

      const { id: systemRoleId } = await tx.role.upsert({
        create: {
          name: "system",
        },
        update: {
          name: "system",
        },
        select: {
          id: true,
        },
        where: {
          name: "system",
        },
      });

      const { id: systemUserId } = await tx.user.upsert({
        create: {
          name: "System",
          password: hashSalt("system"),
          username: "system",
          roleId: systemRoleId,
        },
        update: {
          name: "System",
          password: hashSalt("system"),
          username: "system",
          roleId: systemRoleId,
        },
        where: {
          username: "system",
        },
        select: {
          id: true,
        },
      });

      const [{ id: defaultUserStatusId }] = await Promise.all(
        [
          {
            name: "active",
            createdById: systemUserId,
            updatedById: systemUserId,
          },
          {
            name: "inactive",
            createdById: systemUserId,
            updatedById: systemUserId,
          },
        ].map((userStatus) =>
          tx.userStatus.upsert({
            create: userStatus,
            update: userStatus,
            where: { name: userStatus.name },
            select: { id: true },
          })
        )
      );

      const [{ id: adminRoleId }, { id: employeeRoleId }] = await Promise.all(
        [
          {
            name: "admin",
            createdById: systemUserId,
            updatedById: systemUserId,
          },
          {
            name: "employee",
            createdById: systemUserId,
            updatedById: systemUserId,
          },
        ].map((role) =>
          tx.role.upsert({
            create: role,
            update: role,
            where: {
              name: role.name,
            },
            select: {
              id: true,
            },
          })
        )
      );

      const { id: balajiUserId } = await tx.user.upsert({
        create: {
          name: "Balaji",
          password: hashSalt("balaji"),
          username: "balaji",
          roleId: adminRoleId,
          createdById: systemUserId,
          updatedById: systemUserId,
          statusId: defaultUserStatusId,
        },
        update: {
          name: "Balaji",
          password: hashSalt("balaji"),
          username: "balaji",
          roleId: adminRoleId,
          createdById: systemUserId,
          updatedById: systemUserId,
          statusId: defaultUserStatusId,
        },
        where: {
          username: "balaji",
        },
        select: {
          id: true,
        },
      });

      const { id: sathishUserId } = await tx.user.upsert({
        create: {
          name: "Sathish",
          password: hashSalt("sathish"),
          username: "sathish",
          roleId: adminRoleId,
          createdById: systemUserId,
          updatedById: systemUserId,
          statusId: defaultUserStatusId,
        },
        update: {
          name: "Sathish",
          password: hashSalt("sathish"),
          username: "sathish",
          roleId: adminRoleId,
          createdById: systemUserId,
          updatedById: systemUserId,
          statusId: defaultUserStatusId,
        },
        where: {
          username: "sathish",
        },
        select: {
          id: true,
        },
      });

      const { id: mithunishUserId } = await tx.user.upsert({
        create: {
          name: "Mithunish",
          password: hashSalt("mithunish"),
          username: "mithunish",
          email: "mithunish.p@clubitssolutions.com",
          mobile: "9762123267",
          roleId: employeeRoleId,
          createdById: balajiUserId,
          updatedById: balajiUserId,
          statusId: defaultUserStatusId,
        },
        update: {
          name: "Mithunish",
          password: hashSalt("mithunish"),
          username: "mithunish",
          email: "mithunish.p@clubitssolutions.com",
          mobile: "9762123267",
          roleId: employeeRoleId,
          createdById: balajiUserId,
          updatedById: balajiUserId,
          statusId: defaultUserStatusId,
        },
        where: {
          username: "mithunish",
        },
        select: {
          id: true,
        },
      });

      const { id: muraliUserId } = await tx.user.upsert({
        create: {
          name: "Murali",
          password: hashSalt("murali"),
          username: "murali",
          email: "muralidharan.t@clubitssolutions.com",
          mobile: "6385374777",
          roleId: employeeRoleId,
          createdById: balajiUserId,
          updatedById: balajiUserId,
          statusId: defaultUserStatusId,
        },
        update: {
          name: "Murali",
          password: hashSalt("murali"),
          username: "murali",
          email: "muralidharan.t@clubitssolutions.com",
          mobile: "6385374777",
          roleId: employeeRoleId,
          createdById: balajiUserId,
          updatedById: balajiUserId,
          statusId: defaultUserStatusId,
        },
        where: {
          username: "murali",
        },
        select: {
          id: true,
        },
      });

      const { id: sakthiUserId } = await tx.user.upsert({
        create: {
          name: "Sakthi",
          password: hashSalt("sakthi"),
          username: "sakthi",
          email: "sakthi@clubitssolutions.com",
          mobile: "9677629948",
          roleId: employeeRoleId,
          createdById: balajiUserId,
          updatedById: balajiUserId,
          statusId: defaultUserStatusId,
        },
        update: {
          name: "Sakthi",
          password: hashSalt("sakthi"),
          username: "sakthi",
          email: "sakthi@clubitssolutions.com",
          mobile: "9677629948",
          roleId: employeeRoleId,
          createdById: balajiUserId,
          updatedById: balajiUserId,
          statusId: defaultUserStatusId,
        },
        where: {
          username: "sakthi",
        },
        select: {
          id: true,
        },
      });

      const { id: danielUserId } = await tx.user.upsert({
        create: {
          name: "Daniel",
          password: hashSalt("daniel"),
          username: "daniel",
          roleId: employeeRoleId,
          createdById: balajiUserId,
          updatedById: balajiUserId,
          statusId: defaultUserStatusId,
        },
        update: {
          name: "Daniel",
          password: hashSalt("daniel"),
          username: "daniel",
          roleId: employeeRoleId,
          createdById: balajiUserId,
          updatedById: balajiUserId,
          statusId: defaultUserStatusId,
        },
        where: {
          username: "daniel",
        },
        select: {
          id: true,
        },
      });

      const { id: naveenUserId } = await tx.user.upsert({
        create: {
          name: "Naveen",
          password: hashSalt("naveen"),
          username: "naveen",
          roleId: employeeRoleId,
          createdById: balajiUserId,
          updatedById: balajiUserId,
          statusId: defaultUserStatusId,
        },
        update: {
          name: "Naveen",
          password: hashSalt("naveen"),
          username: "naveen",
          roleId: employeeRoleId,
          createdById: balajiUserId,
          updatedById: balajiUserId,
          statusId: defaultUserStatusId,
        },
        where: {
          username: "naveen",
        },
        select: {
          id: true,
        },
      });

      const { id: vigneshUserId } = await tx.user.upsert({
        create: {
          name: "vignesh S",
          password: hashSalt("vignesh"),
          username: "vignesh",
          email: "vignesh.s@clubitssolutions.com",
          mobile: "7904261582",
          roleId: employeeRoleId,
          createdById: balajiUserId,
          updatedById: balajiUserId,
          statusId: defaultUserStatusId,
        },
        update: {
          name: "vignesh S",
          password: hashSalt("vignesh"),
          username: "vignesh",
          email: "vignesh.s@clubitssolutions.com",
          mobile: "7904261582",
          roleId: employeeRoleId,
          createdById: balajiUserId,
          updatedById: balajiUserId,
          statusId: defaultUserStatusId,
        },
        where: {
          username: "vignesh",
        },
        select: {
          id: true,
        },
      });

      const { id: vishnupriyaUserId } = await tx.user.upsert({
        create: {
          name: "vishnupriya ",
          password: hashSalt("vishnu"),
          username: "vishnu",
          email: "vishnu.e@clubitssolutions.com",
          mobile: "9894153639",
          roleId: employeeRoleId,
          createdById: balajiUserId,
          updatedById: balajiUserId,
          statusId: defaultUserStatusId,
        },
        update: {
          name: "vishnupriya ",
          password: hashSalt("vishnu"),
          username: "vishnu",
          email: "vishnu.e@clubitssolutions.com",
          mobile: "9894153639",
          roleId: employeeRoleId,
          createdById: balajiUserId,
          updatedById: balajiUserId,
          statusId: defaultUserStatusId,
        },
        where: {
          username: "vishnu",
        },
        select: {
          id: true,
        },
      });

      const [{ id: developmentDepartmentId }, { id: designDepartmentId }] =
        await Promise.all(
          [
            {
              name: "Development",
              createdById: balajiUserId,
              updatedById: balajiUserId,
            },
            {
              name: "Design",
              createdById: balajiUserId,
              updatedById: balajiUserId,
            },
          ].map((department) =>
            tx.department.upsert({
              create: department,
              update: department,
              where: {
                name: department.name,
              },
              select: {
                id: true,
              },
            })
          )
        );

      const [
        { id: JuniorFullstackDeveloperDesignationId },
        { id: SeniorFullStackDeveloperDesignationId },
        { id: JuniorProductDesignerDesignationId },
      ] = await Promise.all(
        [
          {
            name: "Junior Fullstack Developer",
            departmentId: developmentDepartmentId,
            createdById: balajiUserId,
            updatedById: balajiUserId,
          },
          {
            name: "Senior Fullstack Developer",
            departmentId: developmentDepartmentId,
            createdById: balajiUserId,
            updatedById: balajiUserId,
          },
          {
            name: "Junior Product Designer",
            departmentId: designDepartmentId,
            createdById: balajiUserId,
            updatedById: balajiUserId,
          },
        ].map((department) =>
          tx.designation.upsert({
            create: department,
            update: department,
            where: {
              name: department.name,
            },
            select: {
              id: true,
            },
          })
        )
      );

      const [
        // { id: ryanPersonalInfoId },
        // { id: davidPersonalInfoId }
      ] = await Promise.all(
        [
          {
            imageUrl: "",
            dateOfBirth: new Date(new Date().setFullYear(1994, 8, 27)),
            dateOfJoining: new Date(new Date().setFullYear(2023, 1, 16)),
            firstName: "Mithunish",
            lastName: "Prabhakaran",
            departmentId: developmentDepartmentId,
            designationId: SeniorFullStackDeveloperDesignationId,
            reportingManagerUserId: balajiUserId,
            userId: mithunishUserId,
            createdById: mithunishUserId,
            updatedById: mithunishUserId,
          },
          {
            imageUrl: "",
            dateOfBirth: new Date(new Date().setFullYear(1995, 4, 25)),
            dateOfJoining: new Date(new Date().setFullYear(2023, 3, 28)),
            firstName: "Murali",
            lastName: "Dharan",
            departmentId: developmentDepartmentId,
            designationId: JuniorFullstackDeveloperDesignationId,
            reportingManagerUserId: balajiUserId,
            userId: muraliUserId,
            createdById: muraliUserId,
            updatedById: muraliUserId,
          },
          {
            imageUrl: "",
            dateOfBirth: new Date(new Date().setFullYear(1998, 11, 23)),
            dateOfJoining: new Date(new Date().setFullYear(2023, 3, 25)),
            firstName: "Siva",
            lastName: "Sakthi",
            departmentId: developmentDepartmentId,
            designationId: JuniorFullstackDeveloperDesignationId,
            reportingManagerUserId: balajiUserId,
            userId: sakthiUserId,
            createdById: sakthiUserId,
            updatedById: sakthiUserId,
          },
          {
            imageUrl: "",
            dateOfBirth: new Date(new Date().setFullYear(2000, 4, 4)),
            dateOfJoining: new Date(new Date().setFullYear(2023, 4, 22)),
            firstName: "Daniel",
            lastName: "Eben",
            departmentId: designDepartmentId,
            designationId: JuniorProductDesignerDesignationId,
            reportingManagerUserId: balajiUserId,
            userId: danielUserId,
            createdById: danielUserId,
            updatedById: danielUserId,
          },
          {
            imageUrl: "",
            dateOfBirth: new Date(new Date().setFullYear(2001, 10, 24)),
            dateOfJoining: new Date(new Date().setFullYear(2023, 1, 22)),
            firstName: "Naveen",
            lastName: "Kumar",
            departmentId: designDepartmentId,
            designationId: JuniorProductDesignerDesignationId,
            reportingManagerUserId: balajiUserId,
            userId: naveenUserId,
            createdById: naveenUserId,
            updatedById: naveenUserId,
          },
          {
            imageUrl: "",
            dateOfBirth: new Date(new Date().setFullYear(1997, 2, 3)),
            dateOfJoining: new Date(new Date().setFullYear(2021, 1, 10)),
            firstName: "Vignesh",
            lastName: "Selvam",
            departmentId: developmentDepartmentId,
            designationId: JuniorFullstackDeveloperDesignationId,
            reportingManagerUserId: balajiUserId,
            userId: vigneshUserId,
            createdById: vigneshUserId,
            updatedById: vigneshUserId,
          },
          {
            imageUrl: "",
            dateOfBirth: new Date(new Date().setFullYear(1998, 2, 5)),
            dateOfJoining: new Date(new Date().setFullYear(2023, 1, 15)),
            firstName: "Vishnu",
            lastName: "Priya",
            departmentId: developmentDepartmentId,
            designationId: JuniorFullstackDeveloperDesignationId,
            reportingManagerUserId: balajiUserId,
            userId: vishnupriyaUserId,
            createdById: vishnupriyaUserId,
            updatedById: vishnupriyaUserId,
          },
        ].map((personalInfo) =>
          tx.personalInfo.upsert({
            create: personalInfo,
            update: personalInfo,
            where: {
              userId: personalInfo.userId,
            },
            select: {
              id: true,
            },
          })
        )
      );

      const [{ id: defaultAddressTypeId }] = await Promise.all(
        [
          {
            name: "residential",
            createdById: systemUserId,
            updatedById: systemUserId,
          },
          {
            name: "others",
            createdById: systemUserId,
            updatedById: systemUserId,
          },
        ].map((addressType) =>
          tx.addressType.upsert({
            create: addressType,
            update: addressType,
            where: { name: addressType.name },
            select: { id: true },
          })
        )
      );

      const [
        // { id: ryanResidentialAddressId },
        // { id: davidResidentialAddressId },
      ] = await Promise.all(
        [
          {
            city: "Tiruvannamalai",
            country: "India",
            pincode: "632311",
            state: "Tamil Nadu",
            street: "2303, Ganapathi Nagar",
            createdById: mithunishUserId,
            updatedById: mithunishUserId,
            userId: mithunishUserId,
            addressTypeId: defaultAddressTypeId,
          },
          {
            city: "Tiruvannamalai",
            country: "India",
            pincode: "606906",
            state: "Tamil Nadu",
            street: "Nadu Street",
            createdById: muraliUserId,
            updatedById: muraliUserId,
            userId: muraliUserId,
            addressTypeId: defaultAddressTypeId,
          },
          {
            city: "Thiruvarur",
            country: "India",
            pincode: "614020",
            state: "Tamil Nadu",
            street: "Anna Street",
            createdById: sakthiUserId,
            updatedById: sakthiUserId,
            userId: sakthiUserId,
            addressTypeId: defaultAddressTypeId,
          },
          {
            city: "Tenkasi",
            country: "India",
            pincode: "627806",
            state: "Tamil Nadu",
            street: "Keela Divaganapuram Street",
            createdById: danielUserId,
            updatedById: danielUserId,
            userId: danielUserId,
            addressTypeId: defaultAddressTypeId,
          },
          {
            city: "Chennai",
            country: "India",
            pincode: "603202",
            state: "Tamil Nadu",
            street: "Guduvancherry",
            createdById: naveenUserId,
            updatedById: naveenUserId,
            userId: naveenUserId,
            addressTypeId: defaultAddressTypeId,
          },
          {
            city: "Namakkal",
            country: "India",
            pincode: "638183",
            state: "Tamil Nadu",
            street: "Kumarapalayam",
            createdById: vigneshUserId,
            updatedById: vigneshUserId,
            userId: vigneshUserId,
            addressTypeId: defaultAddressTypeId,
          },
          {
            city: "Pondicherry",
            country: "India",
            pincode: "605013",
            state: "Tamil Nadu",
            street: "kosapalayam",
            createdById: vishnupriyaUserId,
            updatedById: vishnupriyaUserId,
            userId: vishnupriyaUserId,
            addressTypeId: defaultAddressTypeId,
          },
        ].map((address) =>
          tx.address.create({
            data: address,
            select: {
              id: true,
            },
          })
        )
      );

      const [
        { id: defaultRelationshipTypeId },
        { id: motherRelationshipTypeId },
      ] = await Promise.all(
        [
          {
            name: "father",
            createdById: systemUserId,
            updatedById: systemUserId,
          },
          {
            name: "mother",
            createdById: systemUserId,
            updatedById: systemUserId,
          },
          {
            name: "guardian",
            createdById: systemUserId,
            updatedById: systemUserId,
          },
          {
            name: "brother",
            createdById: systemUserId,
            updatedById: systemUserId,
          },
          {
            name: "sister",
            createdById: systemUserId,
            updatedById: systemUserId,
          },
          {
            name: "spouse",
            createdById: systemUserId,
            updatedById: systemUserId,
          },
          {
            name: "son",
            createdById: systemUserId,
            updatedById: systemUserId,
          },
          {
            name: "daughter",
            createdById: systemUserId,
            updatedById: systemUserId,
          },
        ].map((relationshipType) =>
          tx.relationshipType.upsert({
            create: relationshipType,
            update: relationshipType,
            where: {
              name: relationshipType.name,
            },
            select: { id: true },
          })
        )
      );

      const [
        // { id: muraliFatherFamilyDetailId },
        // { id: sakthiFatherFamilyDetailId },
      ] = await Promise.all(
        [
          {
            dateOfBirth: new Date(new Date().setFullYear(1965, 6, 11)),
            name: "Prabhakaran",
            relationshipTypeId: defaultRelationshipTypeId,
            createdById: mithunishUserId,
            updatedById: mithunishUserId,
            userId: mithunishUserId,
          },
          {
            dateOfBirth: new Date(new Date().setFullYear(1962, 7, 17)),
            name: "Thangamani",
            relationshipTypeId: defaultRelationshipTypeId,
            createdById: muraliUserId,
            updatedById: muraliUserId,
            userId: muraliUserId,
          },
          {
            dateOfBirth: new Date(new Date().setFullYear(1969, 6, 11)),
            name: "Chandrasekaran",
            relationshipTypeId: defaultRelationshipTypeId,
            createdById: sakthiUserId,
            updatedById: sakthiUserId,
            userId: sakthiUserId,
          },
          {
            dateOfBirth: new Date(new Date().setFullYear(1971, 9, 10)),
            name: "Eben Gunaseelan",
            relationshipTypeId: defaultRelationshipTypeId,
            createdById: danielUserId,
            updatedById: danielUserId,
            userId: danielUserId,
          },
          {
            dateOfBirth: new Date(new Date().setFullYear(1969, 7, 23)),
            name: "Suresh Kumar",
            relationshipTypeId: defaultRelationshipTypeId,
            createdById: naveenUserId,
            updatedById: naveenUserId,
            userId: naveenUserId,
          },
          {
            dateOfBirth: new Date(new Date().setFullYear(1968, 6, 20)),
            name: "Selvam",
            relationshipTypeId: defaultRelationshipTypeId,
            createdById: vigneshUserId,
            updatedById: vigneshUserId,
            userId: vigneshUserId,
          },
          {
            dateOfBirth: new Date(new Date().setFullYear(1975, 10, 22)),
            name: "Kala S",
            relationshipTypeId: motherRelationshipTypeId,
            createdById: vigneshUserId,
            updatedById: vigneshUserId,
            userId: vigneshUserId,
          },
          {
            dateOfBirth: new Date(new Date().setFullYear(1968, 2, 3)),
            name: "Elumalai",
            relationshipTypeId: defaultRelationshipTypeId,
            createdById: vishnupriyaUserId,
            updatedById: vishnupriyaUserId,
            userId: vishnupriyaUserId,
          },
        ].map((familyDetail) =>
          tx.familyDetail.create({
            data: familyDetail,
            select: {
              id: true,
            },
          })
        )
      );

      const [{ id: defaultTimeSheetStatusId }] = await Promise.all(
        [
          {
            name: "present",
            createdById: systemUserId,
            updatedById: systemUserId,
          },
          {
            name: "absent",
            createdById: systemUserId,
            updatedById: systemUserId,
          },
        ].map((timeSheetStatus) =>
          tx.timeSheetStatus.upsert({
            create: timeSheetStatus,
            update: timeSheetStatus,
            where: { name: timeSheetStatus.name },
            select: { id: true },
          })
        )
      );

      const [
        // { id: ryanTimeSheetId },
        // { id: davidTimeSheetId }
      ] = await Promise.all(
        [
          {
            inTime: new Date(
              new Date(new Date().setDate(new Date().getDate() - 1)).setHours(
                10,
                0
              )
            ),
            outTime: new Date(
              new Date(new Date().setDate(new Date().getDate() - 1)).setHours(
                18,
                0
              )
            ),
            userId: muraliUserId,
            updatedById: muraliUserId,
            createdById: muraliUserId,
            statusId: defaultTimeSheetStatusId,
          },
          {
            inTime: new Date(
              new Date(new Date().setDate(new Date().getDate() - 1)).setHours(
                9,
                0
              )
            ),
            outTime: new Date(
              new Date(new Date().setDate(new Date().getDate() - 1)).setHours(
                17,
                0
              )
            ),
            userId: sakthiUserId,
            updatedById: sakthiUserId,
            createdById: sakthiUserId,
            statusId: defaultTimeSheetStatusId,
          },
          {
            inTime: new Date(
              new Date(new Date().setDate(new Date().getDate() - 1)).setHours(
                11,
                0
              )
            ),
            outTime: new Date(
              new Date(new Date().setDate(new Date().getDate() - 1)).setHours(
                18,
                0
              )
            ),
            userId: danielUserId,
            updatedById: danielUserId,
            createdById: danielUserId,
            statusId: defaultTimeSheetStatusId,
          },
          {
            inTime: new Date(
              new Date(new Date().setDate(new Date().getDate() - 1)).setHours(
                9,
                0
              )
            ),
            outTime: new Date(
              new Date(new Date().setDate(new Date().getDate() - 1)).setHours(
                17,
                0
              )
            ),
            userId: naveenUserId,
            updatedById: naveenUserId,
            createdById: naveenUserId,
            statusId: defaultTimeSheetStatusId,
          },
          {
            inTime: new Date(
              new Date(new Date().setDate(new Date().getDate() - 1)).setHours(
                9,
                0
              )
            ),
            outTime: new Date(
              new Date(new Date().setDate(new Date().getDate() - 1)).setHours(
                17,
                0
              )
            ),
            userId: vigneshUserId,
            updatedById: vigneshUserId,
            createdById: vigneshUserId,
            statusId: defaultTimeSheetStatusId,
          },
          {
            inTime: new Date(
              new Date(new Date().setDate(new Date().getDate() - 1)).setHours(
                9,
                0
              )
            ),
            outTime: new Date(
              new Date(new Date().setDate(new Date().getDate() - 1)).setHours(
                17,
                0
              )
            ),
            userId: vishnupriyaUserId,
            updatedById: vishnupriyaUserId,
            createdById: vishnupriyaUserId,
            statusId: defaultTimeSheetStatusId,
          },
        ].map((timeSheet) =>
          tx.timeSheet.create({
            data: timeSheet,
            select: {
              id: true,
            },
          })
        )
      );

      const [{ id: defaultPayRollStatusId }] = await Promise.all(
        [
          {
            name: "success",
            createdById: systemUserId,
            updatedById: systemUserId,
          },
          {
            name: "pending",
            createdById: systemUserId,
            updatedById: systemUserId,
          },
          {
            name: "processing",
            createdById: systemUserId,
            updatedById: systemUserId,
          },
          {
            name: "declined",
            createdById: systemUserId,
            updatedById: systemUserId,
          },
        ].map((payRollStatus) =>
          tx.payRollStatus.upsert({
            create: payRollStatus,
            update: payRollStatus,
            where: { name: payRollStatus.name },
            select: { id: true },
          })
        )
      );

      const [{ id: defaultHelpDeskCategory }] = await Promise.all(
        [
          {
            name: "it",
            createdById: systemUserId,
            updatedById: systemUserId,
          },
          {
            name: "health",
            createdById: systemUserId,
            updatedById: systemUserId,
          },
          {
            name: "work",
            createdById: systemUserId,
            updatedById: systemUserId,
          },
          {
            name: "payment",
            createdById: systemUserId,
            updatedById: systemUserId,
          },
        ].map((helpDeskCategory) =>
          tx.helpDeskCategory.upsert({
            create: helpDeskCategory,
            update: helpDeskCategory,
            where: {
              name: helpDeskCategory.name,
            },
            select: { id: true },
          })
        )
      );

      const [{ id: defaultHelpDeskStatus }] = await Promise.all(
        [
          {
            name: "cancelled",
            createdById: systemUserId,
            updatedById: systemUserId,
          },
          {
            name: "pending",
            createdById: systemUserId,
            updatedById: systemUserId,
          },
          {
            name: "resolved",
            createdById: systemUserId,
            updatedById: systemUserId,
          },
        ].map((helpDeskStatus) =>
          tx.helpDeskStatus.upsert({
            create: helpDeskStatus,
            update: helpDeskStatus,
            where: { name: helpDeskStatus.name },
            select: { id: true },
          })
        )
      );

      const [
        { id: aadhaarIdentificationTypeId },
        { id: panIdentificationTypeId },
        { id: passportIdentificationTypeId },
      ] = await Promise.all(
        [
          {
            name: "Aadhaar",
            createdById: systemUserId,
            updatedById: systemUserId,
          },
          {
            name: "PAN",
            createdById: systemUserId,
            updatedById: systemUserId,
          },
          {
            name: "PASSPORT",
            createdById: systemUserId,
            updatedById: systemUserId,
          },
        ].map((identificationType) =>
          tx.identificationType.upsert({
            create: identificationType,
            update: identificationType,
            where: {
              name: identificationType.name,
            },
            select: { id: true },
          })
        )
      );

      const [] = await Promise.all(
        [
          {
            name: "X",
            userId: muraliUserId,
            createdById: muraliUserId,
            updatedById: muraliUserId,
          },

          {
            name: "XII",
            userId: muraliUserId,
            createdById: muraliUserId,
            updatedById: muraliUserId,
          },
          {
            name: "X",
            userId: vigneshUserId,
            createdById: vigneshUserId,
            updatedById: vigneshUserId,
          },

          {
            name: "XII",
            userId: vigneshUserId,
            createdById: vigneshUserId,
            updatedById: vigneshUserId,
          },
          {
            name: "B.Tech-InformationTechnology",
            userId: vigneshUserId,
            createdById: vigneshUserId,
            updatedById: vigneshUserId,
          },
        ].map((qualification) =>
          tx.qualification.upsert({
            create: qualification,
            update: qualification,
            where: {
              name_userId: {
                name: qualification.name,
                userId: qualification.userId,
              },
            },
            select: {
              id: true,
            },
          })
        )
      );

      const [] = await Promise.all(
        [
          {
            typeId: aadhaarIdentificationTypeId,
            number: "876323450987",
            userId: sakthiUserId,
            createdById: sakthiUserId,
            updatedById: sakthiUserId,
          },
          {
            typeId: panIdentificationTypeId,
            number: "HOPSR1236P",
            userId: muraliUserId,
            createdById: muraliUserId,
            updatedById: muraliUserId,
          },
          {
            typeId: passportIdentificationTypeId,
            number: "789GKFY46FGTE",
            userId: muraliUserId,
            createdById: muraliUserId,
            updatedById: muraliUserId,
          },
          {
            typeId: aadhaarIdentificationTypeId,
            number: "309952716504",
            userId: vigneshUserId,
            createdById: vigneshUserId,
            updatedById: vigneshUserId,
          },
          {
            typeId: panIdentificationTypeId,
            number: "AXRPV3985F",
            userId: vigneshUserId,
            createdById: vigneshUserId,
            updatedById: vigneshUserId,
          },
        ].map((identification) =>
          tx.identification.upsert({
            create: identification,
            update: identification,
            where: {
              number: identification.number,
            },
            select: {
              id: true,
            },
          })
        )
      );

      const [{ id: clubitsCompanyId }, { id: genyusCompanyId }] =
        await Promise.all(
          [
            {
              name: "clubits",
              createdById: systemUserId,
              updatedById: systemUserId,
            },
            {
              name: "genyus",
              createdById: systemUserId,
              updatedById: systemUserId,
            },
          ].map((company) =>
            tx.company.upsert({
              create: company,
              update: company,
              where: {
                name: company.name,
              },
              select: { id: true },
            })
          )
        );

      const [{ id: sathishHrId }, { id: balajiHrId }] = await Promise.all(
        [
          {
            userId: sathishUserId,
            companyId: clubitsCompanyId,
            createdById: systemUserId,
            updatedById: systemUserId,
          },
          {
            userId: balajiUserId,
            companyId: genyusCompanyId,
            createdById: systemUserId,
            updatedById: systemUserId,
          },
        ].map((hr) =>
          tx.hr.upsert({
            create: hr,
            update: hr,
            where: {
              userId: hr.userId,
            },
            select: { id: true },
          })
        )
      );

      const [] = await Promise.all(
        [
          {
            userId: sakthiUserId,
            date: new Date(),
            title: "title sample",
            description: "sample description",
            categoryId: defaultHelpDeskCategory,
            statusId: defaultHelpDeskStatus,
            remarks: "remarks",
            createdById: balajiUserId,
            updatedById: balajiUserId,
          },
        ].map((helpDesk) =>
          tx.helpDesk.create({
            data: helpDesk,
            select: {
              id: true,
            },
          })
        )
      );

      const [{ id: defaultVisitorPassStatusId }] = await Promise.all(
        [
          {
            name: "pending",
            createdById: systemUserId,
            updatedById: systemUserId,
          },
          {
            name: "approved",
            createdById: systemUserId,
            updatedById: systemUserId,
          },
          {
            name: "rejected",
            createdById: systemUserId,
            updatedById: systemUserId,
          },
        ].map((visitorPassStatus) =>
          tx.visitorPassStatus.upsert({
            create: visitorPassStatus,
            update: visitorPassStatus,
            where: {
              name: visitorPassStatus.name,
            },
            select: { id: true },
          })
        )
      );
      const [] = await Promise.all(
        [
          {
            imageUrl: "",
            date: new Date(new Date().setFullYear(2023, 12, 23)),
            name: "Shiva",
            fromPlace: "Chennai",
            hrId: balajiHrId,
            companyId: genyusCompanyId,
            inTime: new Date(new Date().setHours(9, 0)),
            outTime: new Date(new Date().setHours(9, 0)),
            reason: "sample reason",
            statusId: defaultVisitorPassStatusId,
            mobileNumber: "987654310",
            createdById: sakthiUserId,
            updatedById: sakthiUserId,
          },
          {
            imageUrl: "",
            date: new Date(new Date().setFullYear(2023, 12, 23)),
            name: "Vidhyuth",
            fromPlace: "Pondicherry",
            hrId: sathishHrId,
            companyId: clubitsCompanyId,
            inTime: new Date(new Date().setHours(9, 0)),
            outTime: new Date(new Date().setHours(9, 0)),
            reason: "sample reason",
            statusId: defaultVisitorPassStatusId,
            mobileNumber: "987654310",
            createdById: sakthiUserId,
            updatedById: sakthiUserId,
          },
        ].map((visitorPass) =>
          tx.visitorPass.create({
            data: visitorPass,
            select: {
              id: true,
            },
          })
        )
      );

      const [
        { id: muraliPayRollId },
        { id: sakthiPayRollId },
        { id: danielPayRollId },
        { id: naveenPayRollId },
        { id: vigneshPayRollId },
      ] = await Promise.all(
        [
          {
            year: new Date().getFullYear(),
            month: new Date().getMonth(),
            userId: muraliUserId,
            createdById: balajiUserId,
            updatedById: balajiUserId,
            statusId: defaultPayRollStatusId,
          },
          {
            year: new Date().getFullYear(),
            month: new Date().getMonth(),
            userId: sakthiUserId,
            createdById: balajiUserId,
            updatedById: balajiUserId,
            statusId: defaultPayRollStatusId,
          },
          {
            year: new Date().getFullYear(),
            month: new Date().getMonth(),
            userId: danielUserId,
            createdById: balajiUserId,
            updatedById: balajiUserId,
            statusId: defaultPayRollStatusId,
          },
          {
            year: new Date().getFullYear(),
            month: new Date().getMonth(),
            userId: naveenUserId,
            createdById: balajiUserId,
            updatedById: balajiUserId,
            statusId: defaultPayRollStatusId,
          },
          {
            year: new Date().getFullYear(),
            month: new Date().getMonth(),
            userId: vigneshUserId,
            createdById: balajiUserId,
            updatedById: balajiUserId,
            statusId: defaultPayRollStatusId,
          },
        ].map((payRoll) =>
          tx.payRoll.create({
            data: payRoll,
            select: {
              id: true,
            },
          })
        )
      );

      const [
        { id: basicPaySlipComponentTypeId },
        { id: hraPaySlipComponentTypeId },
        { id: deductionPaySlipComponentTypeId },
      ] = await Promise.all(
        [
          {
            name: "Basic",
            createdById: systemUserId,
            updatedById: systemUserId,
          },
          {
            name: "HRA",
            createdById: systemUserId,
            updatedById: systemUserId,
          },
          {
            name: "Deduction",
            createdById: systemUserId,
            updatedById: systemUserId,
          },
        ].map((paySlipComponentType) =>
          tx.paySlipComponentType.upsert({
            create: paySlipComponentType,
            update: paySlipComponentType,
            where: {
              name: paySlipComponentType.name,
            },
            select: { id: true },
          })
        )
      );

      const [] = await Promise.all(
        [
          {
            payRollId: muraliPayRollId,
            componentTypeId: basicPaySlipComponentTypeId,
            amount: 10000,
            createdById: balajiUserId,
            updatedById: balajiUserId,
          },
          {
            payRollId: muraliPayRollId,
            componentTypeId: hraPaySlipComponentTypeId,
            amount: 3000,
            createdById: balajiUserId,
            updatedById: balajiUserId,
          },
          {
            payRollId: muraliPayRollId,
            componentTypeId: deductionPaySlipComponentTypeId,
            amount: -200,
            createdById: balajiUserId,
            updatedById: balajiUserId,
          },
          {
            payRollId: sakthiPayRollId,
            componentTypeId: basicPaySlipComponentTypeId,
            amount: 12000,
            createdById: balajiUserId,
            updatedById: balajiUserId,
          },
          {
            payRollId: sakthiPayRollId,
            componentTypeId: hraPaySlipComponentTypeId,
            amount: 3000,
            createdById: balajiUserId,
            updatedById: balajiUserId,
          },
          {
            payRollId: sakthiPayRollId,
            componentTypeId: deductionPaySlipComponentTypeId,
            amount: -500,
            createdById: balajiUserId,
            updatedById: balajiUserId,
          },
          {
            payRollId: danielPayRollId,
            componentTypeId: basicPaySlipComponentTypeId,
            amount: 10000,
            createdById: balajiUserId,
            updatedById: balajiUserId,
          },
          {
            payRollId: danielPayRollId,
            componentTypeId: hraPaySlipComponentTypeId,
            amount: 4500,
            createdById: balajiUserId,
            updatedById: balajiUserId,
          },
          {
            payRollId: danielPayRollId,
            componentTypeId: deductionPaySlipComponentTypeId,
            amount: -300,
            createdById: balajiUserId,
            updatedById: balajiUserId,
          },
          {
            payRollId: naveenPayRollId,
            componentTypeId: basicPaySlipComponentTypeId,
            amount: 10000,
            createdById: balajiUserId,
            updatedById: balajiUserId,
          },
          {
            payRollId: naveenPayRollId,
            componentTypeId: hraPaySlipComponentTypeId,
            amount: 5000,
            createdById: balajiUserId,
            updatedById: balajiUserId,
          },
          {
            payRollId: naveenPayRollId,
            componentTypeId: deductionPaySlipComponentTypeId,
            amount: -700,
            createdById: balajiUserId,
            updatedById: balajiUserId,
          },
          {
            payRollId: vigneshPayRollId,
            componentTypeId: basicPaySlipComponentTypeId,
            amount: 28000,
            createdById: balajiUserId,
            updatedById: balajiUserId,
          },
          {
            payRollId: vigneshPayRollId,
            componentTypeId: hraPaySlipComponentTypeId,
            amount: 3000,
            createdById: balajiUserId,
            updatedById: balajiUserId,
          },
          {
            payRollId: vigneshPayRollId,
            componentTypeId: deductionPaySlipComponentTypeId,
            amount: -2800,
            createdById: balajiUserId,
            updatedById: balajiUserId,
          },
        ].map((paySlipComponent) =>
          tx.paySlipComponent.create({
            data: paySlipComponent,
            select: {
              id: true,
            },
          })
        )
      );

      const [{ id: sickLeaveTypeId }, { id: casualLeaveTypeId }] =
        await Promise.all(
          [
            {
              name: "Sick Leave",
              daysAlloted: 24,
              createdById: balajiUserId,
              updatedById: balajiUserId,
            },
            {
              name: "Casual Leave",
              daysAlloted: 12,
              createdById: balajiUserId,
              updatedById: balajiUserId,
            },
          ].map((leaveType) =>
            tx.leaveType.upsert({
              create: leaveType,
              update: leaveType,
              where: {
                name: leaveType.name,
              },
              select: {
                id: true,
              },
            })
          )
        );

      const [{ id: defaultLeaveStatusId }] = await Promise.all(
        [
          {
            name: "pending",
            createdById: systemUserId,
            updatedById: systemUserId,
          },
          {
            name: "accepted",
            createdById: systemUserId,
            updatedById: systemUserId,
          },
          {
            name: "rejected",
            createdById: systemUserId,
            updatedById: systemUserId,
          },
        ].map((leaveStatus) =>
          tx.leaveStatus.upsert({
            create: leaveStatus,
            update: leaveStatus,
            where: { name: leaveStatus.name },
            select: { id: true },
          })
        )
      );

      const [] = await Promise.all(
        [
          {
            fromDate: new Date(new Date().setDate(new Date().getDate() - 2)),
            toDate: new Date(new Date().setDate(new Date().getDate() - 1)),
            noOfDays: 1,
            createdById: muraliUserId,
            updatedById: muraliUserId,
            leaveTypeId: sickLeaveTypeId,
            userId: muraliUserId,
            remarks: "Please consider.",
            statusId: defaultLeaveStatusId,
          },
          {
            fromDate: new Date(new Date().setDate(new Date().getDate() - 3)),
            toDate: new Date(new Date().setDate(new Date().getDate() - 2)),
            noOfDays: 1,
            createdById: sakthiUserId,
            updatedById: sakthiUserId,
            leaveTypeId: casualLeaveTypeId,
            userId: sakthiUserId,
            remarks: "Please consider.",
            statusId: defaultLeaveStatusId,
          },
          {
            fromDate: new Date(new Date().setDate(new Date().getDate() - 4)),
            toDate: new Date(new Date().setDate(new Date().getDate() - 3)),
            noOfDays: 1,
            createdById: danielUserId,
            updatedById: danielUserId,
            leaveTypeId: sickLeaveTypeId,
            userId: danielUserId,
            remarks: "Please consider.",
            statusId: defaultLeaveStatusId,
          },
          {
            fromDate: new Date(new Date().setDate(new Date().getDate() - 3)),
            toDate: new Date(new Date().setDate(new Date().getDate() - 2)),
            noOfDays: 1,
            createdById: naveenUserId,
            updatedById: naveenUserId,
            leaveTypeId: casualLeaveTypeId,
            userId: naveenUserId,
            remarks: "Please consider.",
            statusId: defaultLeaveStatusId,
          },
          {
            fromDate: new Date(new Date().setDate(new Date().getDate() - 3)),
            toDate: new Date(new Date().setDate(new Date().getDate() - 2)),
            noOfDays: 1,
            createdById: vigneshUserId,
            updatedById: vigneshUserId,
            leaveTypeId: sickLeaveTypeId,
            userId: vigneshUserId,
            remarks: "Please consider.",
            statusId: defaultLeaveStatusId,
          },
        ].map((leave) =>
          tx.leave.create({
            data: leave,
            select: {
              id: true,
            },
          })
        )
      );
    },
    { maxWait: 55000, timeout: 55000 }
  );
};

main()
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
