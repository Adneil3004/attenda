using Attenda.Domain.Common;
using Attenda.Domain.Enums;
using Attenda.Domain.ValueObjects;

namespace Attenda.Domain.Aggregates.EventAggregate;
public class Guest : Entity
{
    public Guid EventId { get; private set; }
    public string FirstName { get; private set; }
    public string LastName { get; private set; }
    public PhoneNumber PhoneNumber { get; private set; }
    public RsvpStatus RsvpStatus { get; private set; }
    public RsvpToken RsvpToken { get; private set; }
    public int PlusOnes { get; private set; } = 0;
    public bool InvitationSent { get; private set; } = false;
    public Guid? GuestGroupId { get; private set; }
    public Guid? TableId { get; private set; }
    
    private readonly List<DietaryRestriction> _dietaryRestrictions = new();
    public IReadOnlyCollection<DietaryRestriction> DietaryRestrictions => _dietaryRestrictions.AsReadOnly();
    public string? Notes { get; private set; }
    public string? PrivateNotes { get; private set; }

    private Guest() : base() { FirstName = null!; LastName = null!; PhoneNumber = null!; RsvpToken = null!; } // Required by EF Core

    private Guest(string firstName, string lastName, PhoneNumber phoneNumber, int plusOnes = 0, Guid? guestGroupId = null, IEnumerable<DietaryRestriction>? dietaryRestrictions = null, string? notes = null) : base()
    {
        FirstName = firstName;
        LastName = lastName;
        PhoneNumber = phoneNumber;
        PlusOnes = plusOnes;
        GuestGroupId = guestGroupId;
        RsvpStatus = RsvpStatus.Pending;
        RsvpToken = RsvpToken.Create();
        if (dietaryRestrictions != null)
        {
            _dietaryRestrictions.AddRange(dietaryRestrictions);
        }
        Notes = notes;
    }

    public static Guest Create(string firstName, string lastName, PhoneNumber phoneNumber, int plusOnes = 0, Guid? guestGroupId = null, IEnumerable<DietaryRestriction>? dietaryRestrictions = null, string? notes = null)
        => new(firstName, lastName, phoneNumber, plusOnes, guestGroupId, dietaryRestrictions, notes);

    public void UpdateRsvpStatus(RsvpStatus status)
    {
        RsvpStatus = status;

        // Regla de Negocio: Si el invitado declina, liberar su asiento automáticamente.
        if (status == RsvpStatus.Declined)
            RemoveFromTable();
    }

    public void AssignToTable(Guid tableId) => TableId = tableId;
    public void RemoveFromTable() => TableId = null;
    
    public void UpdatePlusOnes(int plusOnes)
    {
        if (plusOnes < 0)
            throw new ArgumentException("PlusOnes no puede ser negativo");
        PlusOnes = plusOnes;
    }

    public void MoveToGroup(Guid? groupId) => GuestGroupId = groupId;

    public void MarkInvitationAsSent(string? detail = null)
    {
        InvitationSent = true;
        AddLogEntry("invitation_sent", detail ?? "Invitación enviada");
    }

    public void AddLogEntry(string action, string detail)
    {
        var log = GetLog();
        var entry = new { at = DateTime.UtcNow, action = action, detail = detail };
        log.Add(entry);
        Notes = System.Text.Json.JsonSerializer.Serialize(log);
    }

    private List<dynamic> GetLog()
    {
        if (string.IsNullOrWhiteSpace(Notes)) return new List<dynamic>();
        
        try 
        {
            return System.Text.Json.JsonSerializer.Deserialize<List<dynamic>>(Notes) ?? new List<dynamic>();
        }
        catch 
        {
            // Migrar notas viejas a formato log
            var oldNotes = Notes;
            return new List<dynamic> { new { at = DateTime.UtcNow, action = "legacy_notes", detail = oldNotes } };
        }
    }

    public void UpdateDetails(string firstName, string lastName, PhoneNumber phoneNumber, int plusOnes, Guid? guestGroupId, IEnumerable<DietaryRestriction>? dietaryRestrictions, string? notes = null)
    {
        FirstName = firstName;
        LastName = lastName;
        PhoneNumber = phoneNumber;
        PlusOnes = plusOnes;
        GuestGroupId = guestGroupId;
        
        // Si las notas recibidas NO son el JSON de log, las añadimos como una entrada nueva
        if (!string.IsNullOrWhiteSpace(notes) && !notes.TrimStart().StartsWith("["))
        {
            AddLogEntry("admin_note", notes);
        }
        
        _dietaryRestrictions.Clear();
        if (dietaryRestrictions != null)
        {
            _dietaryRestrictions.AddRange(dietaryRestrictions);
        }
    }

    public void RegisterPlusOnes(IEnumerable<Guest> addedGuests)
    {
        var count = addedGuests.Count();
        if (count == 0) return;

        if (count > PlusOnes)
            throw new InvalidOperationException($"No se pueden agregar {count} invitados adicionales. El cupo es de {PlusOnes}.");

        PlusOnes -= count;

        var names = string.Join(", ", addedGuests.Select(g => $"{g.FirstName} {g.LastName}"));
        PrivateNotes = (string.IsNullOrEmpty(PrivateNotes) ? "" : PrivateNotes + "\n") + $"Acompañantes registrados ({DateTime.UtcNow:d}): {names}";
        
        AddLogEntry("plus_ones_registered", $"Agregó {count} invitados: {names}");
    }
}

