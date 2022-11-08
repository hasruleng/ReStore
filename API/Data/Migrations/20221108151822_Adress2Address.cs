using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace API.Data.Migrations
{
    public partial class Adress2Address : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Adress2",
                table: "UserAddress",
                newName: "Address2");

            migrationBuilder.RenameColumn(
                name: "Adress1",
                table: "UserAddress",
                newName: "Address1");

            migrationBuilder.RenameColumn(
                name: "ShippingAddress_Adress2",
                table: "Orders",
                newName: "ShippingAddress_Address2");

            migrationBuilder.RenameColumn(
                name: "ShippingAddress_Adress1",
                table: "Orders",
                newName: "ShippingAddress_Address1");

            migrationBuilder.UpdateData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: 1,
                column: "ConcurrencyStamp",
                value: "8b69f41b-b541-485d-8cf5-984fb0122718");

            migrationBuilder.UpdateData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: 2,
                column: "ConcurrencyStamp",
                value: "47a8a076-c8e2-4f97-a9ac-dc212f891f60");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Address2",
                table: "UserAddress",
                newName: "Adress2");

            migrationBuilder.RenameColumn(
                name: "Address1",
                table: "UserAddress",
                newName: "Adress1");

            migrationBuilder.RenameColumn(
                name: "ShippingAddress_Address2",
                table: "Orders",
                newName: "ShippingAddress_Adress2");

            migrationBuilder.RenameColumn(
                name: "ShippingAddress_Address1",
                table: "Orders",
                newName: "ShippingAddress_Adress1");

            migrationBuilder.UpdateData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: 1,
                column: "ConcurrencyStamp",
                value: "b2f0e528-61ef-4ee4-8f49-26339838fd13");

            migrationBuilder.UpdateData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: 2,
                column: "ConcurrencyStamp",
                value: "5e2c39f3-5836-47a7-b054-15e0c2d1fcfa");
        }
    }
}
