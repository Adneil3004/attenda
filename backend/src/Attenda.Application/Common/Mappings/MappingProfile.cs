using AutoMapper;
using Attenda.Application.Events.DTOs;
using Attenda.Application.Guests.DTOs;
using Attenda.Domain.Aggregates.EventAggregate;

namespace Attenda.Application.Common.Mappings;

public class MappingProfile : Profile
{
    public MappingProfile()
    {
        CreateMap<Event, EventDto>()
            .ForMember(d => d.StartDate, opt => opt.MapFrom(s => s.Date.StartDate))
            .ForMember(d => d.EndDate, opt => opt.MapFrom(s => s.Date.EndDate))
            .ForMember(d => d.Status, opt => opt.MapFrom(s => s.Status.ToString()));

        CreateMap<Guest, GuestDto>()
            .ForMember(d => d.Email, opt => opt.MapFrom(s => s.Email.ToString()))
            .ForMember(d => d.RsvpStatus, opt => opt.MapFrom(s => s.RsvpStatus.ToString()))
            .ForMember(d => d.DietaryRestrictions, opt => opt.MapFrom(s => s.DietaryRestrictions.Select(r => r.Name).ToList()));
    }
}
