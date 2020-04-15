import { startOfHour } from 'date-fns';
import { getCustomRepository } from 'typeorm';

import Appointment from '../models/Appointment';
import AppointmentsRepository from '../repositories/AppointmentsRepository';

interface Request {
  provider_id: string;
  date: Date;
}

class CreateAppointmentService {
  public async execute({ provider_id, date }: Request): Promise<Appointment> {
    const appointmentDate = startOfHour(date);
    const appointmentsRepository = getCustomRepository(AppointmentsRepository);
    const findAppointmentAtSameDate = await appointmentsRepository.findByDate(
      appointmentDate
    );

    if (findAppointmentAtSameDate) {
      throw Error('This appointment is already booked.');
    }
    const appointment = appointmentsRepository.create({
      provider_id,
      date: appointmentDate,
    });
    await appointmentsRepository.save(appointment);
    return appointment;
  }
}

export default CreateAppointmentService;