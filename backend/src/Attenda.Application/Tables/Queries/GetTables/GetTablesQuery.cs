using Attenda.Application.Tables.DTOs;
using MediatR;

namespace Attenda.Application.Tables.Queries.GetTables;

public record GetTablesQuery(Guid EventId, Guid UserId) : IRequest<List<TableDto>>;
