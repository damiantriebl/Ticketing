import { Ticket } from "../tickets";

it('implements tickets optimistic control', async () => {
    const ticket = Ticket.build({
        title: 'el titulo',
        price: 22,
        userId: '123'
    });

    await ticket.save();
    const firstIteration = await Ticket.findById(ticket.id);
    const secondIteration = await Ticket.findById(ticket.id);

    firstIteration!.set({
        price: 10
    });
    secondIteration!.set({
        price: 15
    });
    firstIteration!.save();
    try {
        await secondIteration!.save();
      } catch (err) {
        return;
      };
    }
)
it('Increment the version number in multiple saves', async () => {
    const ticket = Ticket.build({
        price: 10,
        title: 'some concert',
        userId: '123'
    })
    await ticket.save();
    expect(ticket.version).toEqual(0)
    await ticket.save();
    expect(ticket.version).toEqual(1)
    await ticket.save();
    expect(ticket.version).toEqual(2)
})