"use client";

import Container from '@/components/container';
import TitlePage from '@/components/titlePage';
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { toastError, toastSuccess } from "@/utils/helpers";
import { useMutation } from '@tanstack/react-query';
import { addLostAndFound } from '@/services/api';

const page = () => {
  const [formData, setFormData] = useState({
    item: '',
    type: '',
    description: '',
    dateFound: '',
    status: '',
    image1: null as File | null,
    image2: null as File | null,
    image3: null as File | null,
  });

  const addMutation = useMutation({
    mutationFn: addLostAndFound,
    onSuccess: (data) => {
      if (data.isSuccess) {
        toastSuccess(data.message || "Item added successfully");
        setFormData({
          item: '',
          type: '',
          description: '',
          dateFound: '',
          status: '',
          image1: null,
          image2: null,
          image3: null,
        });
      } else {
        toastError(data.message || "Failed to add item");
      }
    },
    onError: (error) => {
      toastError("An error occurred while submitting the form");
    }
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      setFormData(prev => ({
        ...prev,
        [name]: files[0]
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const formDataToSend = new FormData();
    formDataToSend.append('item', formData.item);
    formDataToSend.append('type', formData.type);
    formDataToSend.append('description', formData.description);
    formDataToSend.append('dateFound', formData.dateFound);
    formDataToSend.append('status', formData.status);
    
    if (formData.image1) {
      formDataToSend.append('image1', formData.image1);
    }
    if (formData.image2) {
      formDataToSend.append('image2', formData.image2);
    }
    if (formData.image3) {
      formDataToSend.append('image3', formData.image3);
    }

    addMutation.mutate(formDataToSend);
  };

  return (
    <Container>
      <TitlePage title="Add Item" hasBack />

      <div className='my-6'>
        <Card>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="item">Item Name *</Label>
                <Input
                  placeholder='Enter item name'
                  id="item"
                  name="item"
                  value={formData.item}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Type *</Label>
                <Select value={formData.type} onValueChange={(value) => handleSelectChange('type', value)} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="lost">Lost</SelectItem>
                    <SelectItem value="found">Found</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  placeholder='Enter description'
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dateFound">Date Found *</Label>
                <Input
                  type="date"
                  id="dateFound"
                  name="dateFound"
                  value={formData.dateFound}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status *</Label>
                <Select value={formData.status} onValueChange={(value) => handleSelectChange('status', value)} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="claimed">Claimed</SelectItem>
                    <SelectItem value="unclaimed">Unclaimed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="image1">Image 1 *</Label>
                <Input
                  type="file"
                  id="image1"
                  name="image1"
                  onChange={handleImageChange}
                  accept="image/*"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="image2">Image 2 (Optional)</Label>
                <Input
                  type="file"
                  id="image2"
                  name="image2"
                  onChange={handleImageChange}
                  accept="image/*"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="image3">Image 3 (Optional)</Label>
                <Input
                  type="file"
                  id="image3"
                  name="image3"
                  onChange={handleImageChange}
                  accept="image/*"
                />
              </div>

              <Button
                type="submit"
                disabled={addMutation.isPending}
                className="w-full"
              >
                {addMutation.isPending ? 'Submitting...' : 'Add Item'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </Container>
  )
}

export default page