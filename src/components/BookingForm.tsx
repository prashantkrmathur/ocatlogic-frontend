import { useEffect, useState } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { toast } from 'sonner';

interface VehicleCategory {
  id: number;
  name: string;
  wheelCount: number;
}

interface Vehicle {
  id: number;
  modelName: string;
  category: VehicleCategory;
}

const API = 'http://localhost:3000/api';

export default function BookingForm() {
  const [step, setStep] = useState(0);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [wheelCount, setWheelCount] = useState<number | null>(null);
  const [categories, setCategories] = useState<VehicleCategory[]>([]);
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [models, setModels] = useState<Vehicle[]>([]);
  const [vehicleId, setVehicleId] = useState<number | null>(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    if (wheelCount) {
      axios.get(`${API}/vehicles/categories?wheelCount=${wheelCount}`).then(res => {
        setCategories(res.data);
      });
    }
  }, [wheelCount]);

  useEffect(() => {
    if (categoryId) {
      axios.get(`${API}/vehicles/models?categoryId=${categoryId}`).then(res => {
        setModels(res.data);
      });
    }
  }, [categoryId]);

  const nextStep = () => setStep((s) => s + 1);
  const prevStep = () => setStep((s) => Math.max(s - 1, 0));

  const handleSubmit = async () => {
    try {
      const res = await axios.post(`${API}/vehicles/booking`, {
        firstName,
        lastName,
        vehicleId,
        startDate,
        endDate,
      });

      toast.success('Booking Successful', {
        description: res.data?.message || 'Vehicle booked successfully.',
      });

      // Reset form
      setStep(0);
      setFirstName('');
      setLastName('');
      setWheelCount(null);
      setCategoryId(null);
      setVehicleId(null);
      setStartDate('');
      setEndDate('');
    } catch (err: any) {
      toast.error('Booking Failed', {
        description: err.response?.data?.message || 'Something went wrong',
      });
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 rounded-xl shadow-md bg-white space-y-6">
      {step === 0 && (
        <div className="space-y-3">
          <Input placeholder="First Name" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
          <Input placeholder="Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)} />
          <div className="flex justify-end">
            <Button onClick={nextStep} disabled={!firstName || !lastName}>Next</Button>
          </div>
        </div>
      )}

      {step === 1 && (
        <div className="space-y-4">
          <RadioGroup value={wheelCount?.toString()} onValueChange={(v) => setWheelCount(Number(v))}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="2" id="wheel2" />
              <Label htmlFor="wheel2">2 Wheels</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="4" id="wheel4" />
              <Label htmlFor="wheel4">4 Wheels</Label>
            </div>
          </RadioGroup>
          <div className="flex justify-between">
            <Button variant="outline" onClick={prevStep}>Back</Button>
            <Button onClick={nextStep} disabled={!wheelCount}>Next</Button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4">
          <RadioGroup value={categoryId?.toString()} onValueChange={(v) => setCategoryId(Number(v))}>
            {categories.map((cat) => (
              <div className="flex items-center space-x-2" key={cat.id}>
                <RadioGroupItem value={cat.id.toString()} id={`cat-${cat.id}`} />
                <Label htmlFor={`cat-${cat.id}`}>{cat.name}</Label>
              </div>
            ))}
          </RadioGroup>
          <div className="flex justify-between">
            <Button variant="outline" onClick={prevStep}>Back</Button>
            <Button onClick={nextStep} disabled={!categoryId}>Next</Button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-4">
          <RadioGroup value={vehicleId?.toString()} onValueChange={(v) => setVehicleId(Number(v))}>
            {models.map((model) => (
              <div className="flex items-center space-x-2" key={model.id}>
                <RadioGroupItem value={model.id.toString()} id={`vehicle-${model.id}`} />
                <Label htmlFor={`vehicle-${model.id}`}>{model.modelName}</Label>
              </div>
            ))}
          </RadioGroup>
          <div className="flex justify-between">
            <Button variant="outline" onClick={prevStep}>Back</Button>
            <Button onClick={nextStep} disabled={!vehicleId}>Next</Button>
          </div>
        </div>
      )}

      {step === 4 && (
        <div className="space-y-4">
          <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
          <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
          <div className="flex justify-between">
            <Button variant="outline" onClick={prevStep}>Back</Button>
            <Button onClick={handleSubmit} disabled={!startDate || !endDate}>Submit</Button>
          </div>
        </div>
      )}
    </div>
  );
}
