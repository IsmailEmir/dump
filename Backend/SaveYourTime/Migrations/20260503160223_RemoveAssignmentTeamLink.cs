using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WebApplication1.Migrations
{
    /// <inheritdoc />
    public partial class RemoveAssignmentTeamLink : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("""
                ALTER TABLE "Assignments" DROP CONSTRAINT IF EXISTS "FK_Assignments_Teams_TeamId";
                """);

            migrationBuilder.Sql("""
                DROP INDEX IF EXISTS "IX_Assignments_TeamId";
                """);

            migrationBuilder.Sql("""
                ALTER TABLE "Assignments" DROP COLUMN IF EXISTS "TeamId";
                """);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "TeamId",
                table: "Assignments",
                type: "integer",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Assignments_TeamId",
                table: "Assignments",
                column: "TeamId");

            migrationBuilder.AddForeignKey(
                name: "FK_Assignments_Teams_TeamId",
                table: "Assignments",
                column: "TeamId",
                principalTable: "Teams",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);
        }
    }
}
