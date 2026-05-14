using Attenda.Application.Guests.DTOs;
using Attenda.Application.Common.Models;
using Attenda.Domain.Enums;
using MediatR;

namespace Attenda.Application.Guests.Queries.GetGuests;

public record GetGuestsQuery(
    Guid EventId, 
    Guid UserId, 
    int PageNumber = 1, 
    int PageSize = 10, 
    string SearchTerm = null, 
    Guid? GroupId = null,
    RsvpStatus? Status = null) : IRequest<PaginatedList<GuestDto>>;
