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
    onSuccess: async (newCarServer, newCar) => {
      await queryClient.cancelQueries({ queryKey: ["cars"] });
  
      const previouscars = queryClient.getQueryData<{ data: { data: any[] } }>(["cars"]);
  
      queryClient.setQueryData<{ data: { data: any[] }; status: number; statusText: string; headers: any; config: any; request: any }>(
        ["cars"],
        (oldcars) => {
          if (!oldcars) return undefined;

          const newCarToSend = {_id: newCarServer?.data?._id, ...newCar};

          const updatedCars = [...oldcars.data.data, newCarToSend];
  
          return {
            ...oldcars,
            data: {
              ...oldcars.data,
              data: updatedCars,
            },
          };
        }
      );
  
      console.log("Added car to cache successfully");
    },
    onError: (error: any) => {
      console.error("Error adding car:", error);
    },
  });
  

  const addCar = () => {
    const { _id, ...carData } = newCar
    addCarMutation.mutate(carData);
    setNewCar({ _id: "", model: "", plate_number: "", color: "" });
  };

  const deleteCarMutation = useMutation({
    mutationFn: delete1,
    onMutate: async (carId) => {
      await queryClient.cancelQueries({ queryKey: ["cars"] });
  
      const previouscars = queryClient.getQueryData<{ data: { data: any[] } }>(["cars"]);
  
      queryClient.setQueryData<{ data: { data: any[] }; status: number; statusText: string; headers: any; config: any; request: any }>(
        ["cars"],
        (oldcars) => {
          if (!oldcars) return undefined; 
  
          const updatedCars = oldcars?.data.data.filter((car) => car._id !== carId);

          return {
            ...oldcars,
            data: {
              ...oldcars.data,
              data: updatedCars,
            },
          };
        }
      );

      return { previouscars };
    },
    onError: (_error, _carId, context) => {
      queryClient.setQueryData(["cars"], context?.previouscars);
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
    onSuccess: async (newCar, variables) => {
      await queryClient.cancelQueries({ queryKey: ["cars"] });
      const previouscars = queryClient.getQueryData<{ data: { data: any[] } }>(["cars"]);

      queryClient.setQueryData<{ data: { data: any[] }; status: number; statusText: string; headers: any; config: any; request: any }>(
        ["cars"],
        (oldcars) => {
          if (!oldcars) return undefined;

      let updateCar={_id:variables.id,...variables.updatedCar}

          const updatedCars = oldcars.data.data.map((car) =>
            car._id !== variables.id ? car : updateCar
          );
  
          return {
            ...oldcars,
            data: {
              ...oldcars.data,
              data: updatedCars,
            },
          };
        }
      );
  
      return { previouscars };
    },
    onError: (error: any) => {
      console.error("Error updating car:", error);
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
