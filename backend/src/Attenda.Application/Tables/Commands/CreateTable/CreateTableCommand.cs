using Attenda.Application.Tables.DTOs;
using Attenda.Domain.Enums;
using MediatR;

namespace Attenda.Application.Tables.Commands.CreateTable;

public record CreateTableCommand(
    Guid EventId,
    string Name,
    int Capacity,
    TablePriority Priority,
    Guid UserId) : IRequest<TableDto>;
