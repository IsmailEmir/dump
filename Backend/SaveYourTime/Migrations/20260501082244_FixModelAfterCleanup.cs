using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace WebApplication1.Migrations
{
    /// <inheritdoc />
    public partial class FixModelAfterCleanup : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "AssignmentPriorities",
                columns: new[] { "Id", "Name" },
                values: new object[,]
                {
                    { 1, "low" },
                    { 2, "medium" },
                    { 3, "high" }
                });

            migrationBuilder.InsertData(
                table: "AssignmentStatuses",
                columns: new[] { "Id", "Name" },
                values: new object[,]
                {
                    { 1, "todo" },
                    { 2, "in-progress" },
                    { 3, "done" }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AssignmentPriorities",
                keyColumn: "Id",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "AssignmentPriorities",
                keyColumn: "Id",
                keyValue: 2);

            migrationBuilder.DeleteData(
                table: "AssignmentPriorities",
                keyColumn: "Id",
                keyValue: 3);

            migrationBuilder.DeleteData(
                table: "AssignmentStatuses",
                keyColumn: "Id",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "AssignmentStatuses",
                keyColumn: "Id",
                keyValue: 2);

            migrationBuilder.DeleteData(
                table: "AssignmentStatuses",
                keyColumn: "Id",
                keyValue: 3);
        }
    }
}
