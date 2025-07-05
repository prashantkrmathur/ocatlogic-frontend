import { useEffect, useState } from 'react';

import axios from 'axios';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { RadioGroup, RadioGroupItem } from '@radix-ui/react-radio-group';

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
  // const { toast } = useToast(); // Removed unused hook
 
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
      alert('Booking Successful: ' + res.data.message); // Replaced with alert for feedback
      setStep(0);
      setFirstName('');
      setLastName('');
      setWheelCount(null);
      setCategoryId(null);
      setVehicleId(null);
      setStartDate('');
      setEndDate('');
    } catch (err: any) {
      alert('Booking Failed: ' + (err.response?.data?.message || 'Error')); // Replaced with alert for feedback
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
            <label className="flex items-center space-x-2">
            <label className="flex items-center space-x-2">
              <RadioGroupItem value="4" />
              <span>4 Wheels</span>
            </label>
              <span>2 Wheels</span>
            </label>
            <label className="flex items-center space-x-2">
              <RadioGroupItem value="4" />
              <span>4 Wheels</span>
            </label>
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
              <label className="flex items-center space-x-2">
                <RadioGroupItem key={cat.id} value={cat.id.toString()} />
                <span>{cat.name}</span>
              </label>
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
            <label className="flex items-center space-x-2">
                <RadioGroupItem key={model.id} value={model.id.toString()} />
                <span>{model.modelName}</span>
              </label>
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
