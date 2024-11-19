"use client";
import styles from "./Cars.module.css";
import { add, delete1, getAll, update } from "@/Servises/service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

export default function Cars() {
  const queryClient = useQueryClient()

  const [newCar, setNewCar] = useState<any>({
    _id: "",
    model: "",
    plate_number: "",
    color: "",
  });
  const [submitState, setSubmitState] = useState<string>("");

  const {isPending, isError, data:cars, isLoading, error } = useQuery({
    queryKey: ["cars"],
    queryFn: getAll,
    staleTime: 600000,
  });

  const addCarMutation = useMutation({
    mutationFn: add, 
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cars"] });
    },
    onError: (error: any) => {
      console.error("Error deleting car:", error);
    },
  });

  const addCar = () => {
    const { _id, ...carData } = newCar
    addCarMutation.mutate(carData);
    setNewCar({ _id: "", model: "", plate_number: "", color: "" });
  };

  const deleteCarMutation = useMutation({
    mutationFn: delete1, 
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cars"] });
      console.log("Deleted car with ID:",cars);
    },
    onError: (error: any) => {
      console.error("Error deleting car:", error);
    },
  });

  const deleteCar = (id: string) => {
    deleteCarMutation.mutate(id);
  };

  const updateCar = async (car: any) => {
    setNewCar(car);
    setSubmitState("update");
  };

  const updateCarMutation = useMutation({
    mutationFn: (carData: { id: string, updatedCar: any }) => update(carData.id, carData.updatedCar), 
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cars"] });
    },
    onError: (error: any) => {
      console.error("Error deleting car:", error);
    },
  });

  const updateCarInServer = () => {
    const { _id, ...carData } = newCar;
    updateCarMutation.mutate({ id: _id, updatedCar: carData });
    setNewCar({ _id: "", model: "", plate_number: "", color: "" });
  };

  const submit = () => {
    if (submitState === "update") {
      updateCarInServer();
    } else {
      addCar();
    }
    setSubmitState("");
  };


  if (isPending) {
    return <span>Loading...</span>
  }

  if (isError) {
    return <span>Error: {error.message}</span>
  }

  return (
    <>
    <div className={styles.container}>
      <div className={styles.carList}>
        {cars?.data.data.map((car:any, index:any) => (
          <div key={index} className={styles.carItem}>
            <p>
              <strong>Model:</strong> {car.model}
            </p>
            <p>
              <strong>Color:</strong> {car.color}
            </p>
            <p>
              <strong>Plate Number:</strong> {car.plate_number}
            </p>
            <button
              onClick={() => deleteCar(car._id)}
              className={styles.button}
            >
              delete Car
            </button>
            <button onClick={() => updateCar(car)} className={styles.button}>
              update Car
            </button>
          </div>
        ))}
      </div>

      <input
        type="text"
        value={newCar.model}
        onChange={(e) => setNewCar({ ...newCar, model: e.target.value })}
        placeholder="Car model"
        className={styles.inputField}
      />
      <input
        type="text"
        value={newCar.plate_number}
        onChange={(e) => setNewCar({ ...newCar, plate_number: e.target.value })}
        placeholder="Plate number"
        className={styles.inputField}
      />
      <input
        type="text"
        value={newCar.color}
        onChange={(e) => setNewCar({ ...newCar, color: e.target.value })}
        placeholder="Car color"
        className={styles.inputField}
      />
      <button onClick={submit} className={styles.addCarButton}>
        V
      </button>
    </div>
    </>
  );
}
