using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace WebApplication1.Migrations
{
    /// <inheritdoc />
    public partial class AddTeamAssignments : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("""
                ALTER TABLE "Assignments" DROP CONSTRAINT IF EXISTS "FK_Assignments_Teams_TeamId";
                """);

            migrationBuilder.CreateTable(
                name: "TeamAssignments",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Name = table.Column<string>(type: "text", nullable: false),
                    Description = table.Column<string>(type: "text", nullable: true),
                    TeamId = table.Column<int>(type: "integer", nullable: false),
                    StatusId = table.Column<int>(type: "integer", nullable: false),
                    UserId = table.Column<int>(type: "integer", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TeamAssignments", x => x.Id);
                    table.ForeignKey(
                        name: "FK_TeamAssignments_AssignmentStatuses_StatusId",
                        column: x => x.StatusId,
                        principalTable: "AssignmentStatuses",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_TeamAssignments_Teams_TeamId",
                        column: x => x.TeamId,
                        principalTable: "Teams",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_TeamAssignments_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                });

            migrationBuilder.CreateIndex(
                name: "IX_TeamAssignments_StatusId",
                table: "TeamAssignments",
                column: "StatusId");

            migrationBuilder.CreateIndex(
                name: "IX_TeamAssignments_TeamId",
                table: "TeamAssignments",
                column: "TeamId");

            migrationBuilder.CreateIndex(
                name: "IX_TeamAssignments_UserId",
                table: "TeamAssignments",
                column: "UserId");

            migrationBuilder.Sql("""
                DO $$
                BEGIN
                    IF EXISTS (
                        SELECT 1
                        FROM information_schema.columns
                        WHERE table_schema = 'public'
                          AND table_name = 'Assignments'
                          AND column_name = 'TeamId'
                    ) THEN
                        ALTER TABLE "Assignments"
                            ADD CONSTRAINT "FK_Assignments_Teams_TeamId"
                            FOREIGN KEY ("TeamId") REFERENCES "Teams"("Id")
                            ON DELETE SET NULL;
                    END IF;
                END $$;
                """);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("""
                ALTER TABLE "Assignments" DROP CONSTRAINT IF EXISTS "FK_Assignments_Teams_TeamId";
                """);

            migrationBuilder.DropTable(
                name: "TeamAssignments");

            migrationBuilder.Sql("""
                DO $$
                BEGIN
                    IF EXISTS (
                        SELECT 1
                        FROM information_schema.columns
                        WHERE table_schema = 'public'
                          AND table_name = 'Assignments'
                          AND column_name = 'TeamId'
                    ) THEN
                        ALTER TABLE "Assignments"
                            ADD CONSTRAINT "FK_Assignments_Teams_TeamId"
                            FOREIGN KEY ("TeamId") REFERENCES "Teams"("Id");
                    END IF;
                END $$;
                """);
        }
    }
}
