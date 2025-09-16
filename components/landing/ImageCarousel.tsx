"use client";

import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { MoveLeft, MoveRight } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";

interface Image {
  path: string;
}

export default function ImageCarousel() {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const images: Image[] = [
    { path: "/dashboard-demo.png" },
    { path: "/app-tracker-demo.png" },
    { path: "/resume-demo.png" },
  ];

  useEffect(() => {
    if (!api) {
      return;
    }

    setCurrent(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  return (
    <Carousel
      className="w-full flex flex-col items-center"
      opts={{
        align: "start",
        loop: true,
      }}
      setApi={setApi}
    >
      <CarouselContent>
        {images.map((image, index) => (
          <CarouselItem
            key={index}
            className="flex items-center justify-center"
          >
            <Image
              src={image.path}
              alt="Demo Image"
              width={500}
              height={250}
              unoptimized
              className="md:w-8/10
              object-cover rounded-2xl"
              loading="lazy"
            />
          </CarouselItem>
        ))}
      </CarouselContent>
      <div className="flex gap-3">
        <Button onClick={() => api?.scrollTo(current - 1)}>
          <MoveLeft />
        </Button>
        <Button onClick={() => api?.scrollTo(current + 1)}>
          <MoveRight />
        </Button>
      </div>
    </Carousel>
  );
}
