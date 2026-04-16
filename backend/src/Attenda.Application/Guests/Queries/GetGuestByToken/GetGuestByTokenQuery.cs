using Attenda.Application.Guests.DTOs;
using MediatR;

namespace Attenda.Application.Guests.Queries.GetGuestByToken;

public record GetGuestByTokenQuery(string Token) : IRequest<GuestRsvpDto?>;
