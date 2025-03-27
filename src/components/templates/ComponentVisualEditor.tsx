import { useState } from 'react';
import { TemplateComponent, ComponentProps } from '@/types/template';
import { FiEdit2, FiTrash2, FiPlus, FiX, FiSave, FiImage } from 'react-icons/fi';
import ImageGallery from '@/components/common/ImageGallery';

interface ComponentVisualEditorProps {
  component: TemplateComponent;
  onSave: (component: TemplateComponent) => void;
  onCancel: () => void;
}

export default function ComponentVisualEditor({ component, onSave, onCancel }: ComponentVisualEditorProps) {
  const [editedComponent, setEditedComponent] = useState<TemplateComponent>({
    ...component,
    props: {
      ...component.props,
      hero: component.props.hero || {
        title: '',
        subtitle: '',
        description: '',
        buttonText: '',
        buttonLink: '',
        imageUrl: '',
        backgroundType: 'image'
      },
      features: component.props.features || {
        title: '',
        subtitle: '',
        items: [],
        layout: 'grid'
      },
      pricing: component.props.pricing || {
        title: '',
        subtitle: '',
        plans: [],
        layout: 'grid'
      },
      testimonials: component.props.testimonials || {
        title: '',
        subtitle: '',
        items: [],
        layout: 'grid'
      },
      cta: component.props.cta || {
        title: '',
        subtitle: '',
        buttonText: '',
        buttonLink: '',
        backgroundType: 'solid'
      },
      footer: component.props.footer || {
        logo: '',
        description: '',
        links: [],
        socialLinks: []
      },
      stats: component.props.stats || {
        title: '',
        subtitle: '',
        items: [],
        layout: 'grid'
      },
      team: component.props.team || {
        title: '',
        subtitle: '',
        members: [],
        layout: 'grid'
      },
      blog: component.props.blog || {
        title: '',
        subtitle: '',
        posts: [],
        layout: 'grid'
      },
      contact: component.props.contact || {
        title: '',
        subtitle: '',
        formFields: [],
        layout: 'split'
      }
    }
  });

  const [showImageGallery, setShowImageGallery] = useState(false);
  const [currentImageField, setCurrentImageField] = useState<{
    component: string;
    field: string;
    index?: number;
  } | null>(null);

  const handleImageSelect = (imageUrl: string) => {
    if (!currentImageField) return;

    const { component: componentType, field, index } = currentImageField;
    setEditedComponent(prev => {
      const newComponent = { ...prev };
      if (index !== undefined) {
        // Handle array items (e.g., team members, blog posts)
        const items = [...newComponent.props[componentType].items];
        items[index] = { ...items[index], [field]: imageUrl };
        newComponent.props[componentType].items = items;
      } else {
        // Handle direct properties
        newComponent.props[componentType][field] = imageUrl;
      }
      return newComponent;
    });
    setShowImageGallery(false);
    setCurrentImageField(null);
  };

  const renderImageField = (
    componentType: string,
    field: string,
    value: string,
    index?: number
  ) => (
    <div className="flex items-center gap-2">
      <input
        type="text"
        value={value}
        onChange={(e) => {
          setEditedComponent(prev => {
            const newComponent = { ...prev };
            if (index !== undefined) {
              const items = [...newComponent.props[componentType].items];
              items[index] = { ...items[index], [field]: e.target.value };
              newComponent.props[componentType].items = items;
            } else {
              newComponent.props[componentType][field] = e.target.value;
            }
            return newComponent;
          });
        }}
        className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        placeholder={`Enter ${field} URL`}
      />
      <button
        onClick={() => {
          setCurrentImageField({ component: componentType, field, index });
          setShowImageGallery(true);
        }}
        className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        <FiImage className="mr-2 h-4 w-4" />
        Choose Image
      </button>
    </div>
  );

  const handleSave = () => {
    onSave(editedComponent);
  };

  const renderEditorFields = () => {
    switch (component.type) {
      case 'hero': {
        const heroProps = editedComponent.props.hero as ComponentProps['hero'];
        if (!heroProps) return null;

        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Title</label>
              <input
                type="text"
                value={heroProps.title}
                onChange={(e) => setEditedComponent({
                  ...editedComponent,
                  props: {
                    ...editedComponent.props,
                    hero: {
                      ...heroProps,
                      title: e.target.value
                    }
                  }
                })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Subtitle</label>
              <input
                type="text"
                value={heroProps.subtitle}
                onChange={(e) => setEditedComponent({
                  ...editedComponent,
                  props: {
                    ...editedComponent.props,
                    hero: {
                      ...heroProps,
                      subtitle: e.target.value
                    }
                  }
                })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                value={heroProps.description}
                onChange={(e) => setEditedComponent({
                  ...editedComponent,
                  props: {
                    ...editedComponent.props,
                    hero: {
                      ...heroProps,
                      description: e.target.value
                    }
                  }
                })}
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Button Text</label>
              <input
                type="text"
                value={heroProps.buttonText}
                onChange={(e) => setEditedComponent({
                  ...editedComponent,
                  props: {
                    ...editedComponent.props,
                    hero: {
                      ...heroProps,
                      buttonText: e.target.value
                    }
                  }
                })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Button Link</label>
              <input
                type="text"
                value={heroProps.buttonLink}
                onChange={(e) => setEditedComponent({
                  ...editedComponent,
                  props: {
                    ...editedComponent.props,
                    hero: {
                      ...heroProps,
                      buttonLink: e.target.value
                    }
                  }
                })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Image URL</label>
              {renderImageField('hero', 'imageUrl', heroProps.imageUrl)}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Background Type</label>
              <select
                value={heroProps.backgroundType}
                onChange={(e) => setEditedComponent({
                  ...editedComponent,
                  props: {
                    ...editedComponent.props,
                    hero: {
                      ...heroProps,
                      backgroundType: e.target.value as 'image' | 'video' | 'gradient'
                    }
                  }
                })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="image">Image</option>
                <option value="video">Video</option>
                <option value="gradient">Gradient</option>
              </select>
            </div>
          </div>
        );
      }

      case 'features': {
        const featuresProps = editedComponent.props.features as ComponentProps['features'];
        if (!featuresProps) return null;

        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Title</label>
              <input
                type="text"
                value={featuresProps.title}
                onChange={(e) => setEditedComponent({
                  ...editedComponent,
                  props: {
                    ...editedComponent.props,
                    features: {
                      ...featuresProps,
                      title: e.target.value
                    }
                  }
                })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Layout</label>
              <select
                value={featuresProps.layout}
                onChange={(e) => setEditedComponent({
                  ...editedComponent,
                  props: {
                    ...editedComponent.props,
                    features: {
                      ...featuresProps,
                      layout: e.target.value as 'grid' | 'list' | 'timeline'
                    }
                  }
                })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="grid">Grid</option>
                <option value="list">List</option>
                <option value="timeline">Timeline</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Features</label>
              <div className="space-y-2">
                {featuresProps.items.map((item, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={item.title}
                      onChange={(e) => {
                        const newItems = [...featuresProps.items];
                        newItems[index] = { ...item, title: e.target.value };
                        setEditedComponent({
                          ...editedComponent,
                          props: {
                            ...editedComponent.props,
                            features: {
                              ...featuresProps,
                              items: newItems
                            }
                          }
                        });
                      }}
                      className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      placeholder="Feature title"
                    />
                    <textarea
                      value={item.description}
                      onChange={(e) => {
                        const newItems = [...featuresProps.items];
                        newItems[index] = { ...item, description: e.target.value };
                        setEditedComponent({
                          ...editedComponent,
                          props: {
                            ...editedComponent.props,
                            features: {
                              ...featuresProps,
                              items: newItems
                            }
                          }
                        });
                      }}
                      className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      placeholder="Feature description"
                    />
                    <button
                      onClick={() => {
                        const newItems = featuresProps.items.filter((_, i) => i !== index);
                        setEditedComponent({
                          ...editedComponent,
                          props: {
                            ...editedComponent.props,
                            features: {
                              ...featuresProps,
                              items: newItems
                            }
                          }
                        });
                      }}
                      className="text-red-600 hover:text-red-800"
                    >
                      <FiTrash2 className="h-5 w-5" />
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => {
                    setEditedComponent({
                      ...editedComponent,
                      props: {
                        ...editedComponent.props,
                        features: {
                          ...featuresProps,
                          items: [
                            ...featuresProps.items,
                            { title: '', description: '', icon: 'FiCheck' }
                          ]
                        }
                      }
                    });
                  }}
                  className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800"
                >
                  <FiPlus className="mr-1 h-4 w-4" />
                  Add Feature
                </button>
              </div>
            </div>
          </div>
        );
      }

      case 'pricing': {
        const pricingProps = editedComponent.props.pricing as ComponentProps['pricing'];
        if (!pricingProps) return null;

        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Title</label>
              <input
                type="text"
                value={pricingProps.title}
                onChange={(e) => setEditedComponent({
                  ...editedComponent,
                  props: {
                    ...editedComponent.props,
                    pricing: {
                      ...pricingProps,
                      title: e.target.value
                    }
                  }
                })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Layout</label>
              <select
                value={pricingProps.layout}
                onChange={(e) => setEditedComponent({
                  ...editedComponent,
                  props: {
                    ...editedComponent.props,
                    pricing: {
                      ...pricingProps,
                      layout: e.target.value as 'grid' | 'list'
                    }
                  }
                })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="grid">Grid</option>
                <option value="list">List</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Plans</label>
              <div className="space-y-4">
                {pricingProps.plans.map((plan, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <input
                        type="text"
                        value={plan.name}
                        onChange={(e) => {
                          const newPlans = [...pricingProps.plans];
                          newPlans[index] = { ...plan, name: e.target.value };
                          setEditedComponent({
                            ...editedComponent,
                            props: {
                              ...editedComponent.props,
                              pricing: {
                                ...pricingProps,
                                plans: newPlans
                              }
                            }
                          });
                        }}
                        className="text-lg font-medium rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        placeholder="Plan name"
                      />
                      <button
                        onClick={() => {
                          const newPlans = pricingProps.plans.filter((_, i) => i !== index);
                          setEditedComponent({
                            ...editedComponent,
                            props: {
                              ...editedComponent.props,
                              pricing: {
                                ...pricingProps,
                                plans: newPlans
                              }
                            }
                          });
                        }}
                        className="text-red-600 hover:text-red-800"
                      >
                        <FiTrash2 className="h-5 w-5" />
                      </button>
                    </div>
                    <div className="space-y-2">
                      <input
                        type="text"
                        value={plan.price}
                        onChange={(e) => {
                          const newPlans = [...pricingProps.plans];
                          newPlans[index] = { ...plan, price: e.target.value };
                          setEditedComponent({
                            ...editedComponent,
                            props: {
                              ...editedComponent.props,
                              pricing: {
                                ...pricingProps,
                                plans: newPlans
                              }
                            }
                          });
                        }}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        placeholder="Price"
                      />
                      <textarea
                        value={plan.description}
                        onChange={(e) => {
                          const newPlans = [...pricingProps.plans];
                          newPlans[index] = { ...plan, description: e.target.value };
                          setEditedComponent({
                            ...editedComponent,
                            props: {
                              ...editedComponent.props,
                              pricing: {
                                ...pricingProps,
                                plans: newPlans
                              }
                            }
                          });
                        }}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        placeholder="Description"
                      />
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Features</label>
                        {plan.features.map((feature, featureIndex) => (
                          <div key={featureIndex} className="flex items-center gap-2">
                            <input
                              type="text"
                              value={feature}
                              onChange={(e) => {
                                const newFeatures = [...plan.features];
                                newFeatures[featureIndex] = e.target.value;
                                const newPlans = [...pricingProps.plans];
                                newPlans[index] = { ...plan, features: newFeatures };
                                setEditedComponent({
                                  ...editedComponent,
                                  props: {
                                    ...editedComponent.props,
                                    pricing: {
                                      ...pricingProps,
                                      plans: newPlans
                                    }
                                  }
                                });
                              }}
                              className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                              placeholder="Feature"
                            />
                            <button
                              onClick={() => {
                                const newFeatures = plan.features.filter((_, i) => i !== featureIndex);
                                const newPlans = [...pricingProps.plans];
                                newPlans[index] = { ...plan, features: newFeatures };
                                setEditedComponent({
                                  ...editedComponent,
                                  props: {
                                    ...editedComponent.props,
                                    pricing: {
                                      ...pricingProps,
                                      plans: newPlans
                                    }
                                  }
                                });
                              }}
                              className="text-red-600 hover:text-red-800"
                            >
                              <FiTrash2 className="h-5 w-5" />
                            </button>
                          </div>
                        ))}
                        <button
                          onClick={() => {
                            const newFeatures = [...plan.features, ''];
                            const newPlans = [...pricingProps.plans];
                            newPlans[index] = { ...plan, features: newFeatures };
                            setEditedComponent({
                              ...editedComponent,
                              props: {
                                ...editedComponent.props,
                                pricing: {
                                  ...pricingProps,
                                  plans: newPlans
                                }
                              }
                            });
                          }}
                          className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800"
                        >
                          <FiPlus className="mr-1 h-4 w-4" />
                          Add Feature
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                <button
                  onClick={() => {
                    setEditedComponent({
                      ...editedComponent,
                      props: {
                        ...editedComponent.props,
                        pricing: {
                          ...pricingProps,
                          plans: [
                            ...pricingProps.plans,
                            {
                              name: '',
                              price: '',
                              description: '',
                              features: []
                            }
                          ]
                        }
                      }
                    });
                  }}
                  className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800"
                >
                  <FiPlus className="mr-1 h-4 w-4" />
                  Add Plan
                </button>
              </div>
            </div>
          </div>
        );
      }

      case 'testimonials': {
        const testimonialsProps = editedComponent.props.testimonials as ComponentProps['testimonials'];
        if (!testimonialsProps) return null;

        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Title</label>
              <input
                type="text"
                value={testimonialsProps.title}
                onChange={(e) => setEditedComponent({
                  ...editedComponent,
                  props: {
                    ...editedComponent.props,
                    testimonials: {
                      ...testimonialsProps,
                      title: e.target.value
                    }
                  }
                })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Layout</label>
              <select
                value={testimonialsProps.layout}
                onChange={(e) => setEditedComponent({
                  ...editedComponent,
                  props: {
                    ...editedComponent.props,
                    testimonials: {
                      ...testimonialsProps,
                      layout: e.target.value as 'grid' | 'carousel'
                    }
                  }
                })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="grid">Grid</option>
                <option value="carousel">Carousel</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Testimonials</label>
              <div className="space-y-4">
                {testimonialsProps.items.map((item, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <input
                        type="text"
                        value={item.author}
                        onChange={(e) => {
                          const newItems = [...testimonialsProps.items];
                          newItems[index] = { ...item, author: e.target.value };
                          setEditedComponent({
                            ...editedComponent,
                            props: {
                              ...editedComponent.props,
                              testimonials: {
                                ...testimonialsProps,
                                items: newItems
                              }
                            }
                          });
                        }}
                        className="text-lg font-medium rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        placeholder="Author name"
                      />
                      <button
                        onClick={() => {
                          const newItems = testimonialsProps.items.filter((_, i) => i !== index);
                          setEditedComponent({
                            ...editedComponent,
                            props: {
                              ...editedComponent.props,
                              testimonials: {
                                ...testimonialsProps,
                                items: newItems
                              }
                            }
                          });
                        }}
                        className="text-red-600 hover:text-red-800"
                      >
                        <FiTrash2 className="h-5 w-5" />
                      </button>
                    </div>
                    <div className="space-y-2">
                      <textarea
                        value={item.content}
                        onChange={(e) => {
                          const newItems = [...testimonialsProps.items];
                          newItems[index] = { ...item, content: e.target.value };
                          setEditedComponent({
                            ...editedComponent,
                            props: {
                              ...editedComponent.props,
                              testimonials: {
                                ...testimonialsProps,
                                items: newItems
                              }
                            }
                          });
                        }}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        placeholder="Testimonial content"
                      />
                      <input
                        type="text"
                        value={item.role}
                        onChange={(e) => {
                          const newItems = [...testimonialsProps.items];
                          newItems[index] = { ...item, role: e.target.value };
                          setEditedComponent({
                            ...editedComponent,
                            props: {
                              ...editedComponent.props,
                              testimonials: {
                                ...testimonialsProps,
                                items: newItems
                              }
                            }
                          });
                        }}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        placeholder="Author role"
                      />
                      <input
                        type="text"
                        value={item.imageUrl}
                        onChange={(e) => {
                          const newItems = [...testimonialsProps.items];
                          newItems[index] = { ...item, imageUrl: e.target.value };
                          setEditedComponent({
                            ...editedComponent,
                            props: {
                              ...editedComponent.props,
                              testimonials: {
                                ...testimonialsProps,
                                items: newItems
                              }
                            }
                          });
                        }}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        placeholder="Author image URL"
                      />
                    </div>
                  </div>
                ))}
                <button
                  onClick={() => {
                    setEditedComponent({
                      ...editedComponent,
                      props: {
                        ...editedComponent.props,
                        testimonials: {
                          ...testimonialsProps,
                          items: [
                            ...testimonialsProps.items,
                            {
                              author: '',
                              content: '',
                              role: '',
                              imageUrl: ''
                            }
                          ]
                        }
                      }
                    });
                  }}
                  className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800"
                >
                  <FiPlus className="mr-1 h-4 w-4" />
                  Add Testimonial
                </button>
              </div>
            </div>
          </div>
        );
      }

      case 'cta': {
        const ctaProps = editedComponent.props.cta as ComponentProps['cta'];
        if (!ctaProps) return null;

        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Title</label>
              <input
                type="text"
                value={ctaProps.title}
                onChange={(e) => setEditedComponent({
                  ...editedComponent,
                  props: {
                    ...editedComponent.props,
                    cta: {
                      ...ctaProps,
                      title: e.target.value
                    }
                  }
                })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Subtitle</label>
              <input
                type="text"
                value={ctaProps.subtitle}
                onChange={(e) => setEditedComponent({
                  ...editedComponent,
                  props: {
                    ...editedComponent.props,
                    cta: {
                      ...ctaProps,
                      subtitle: e.target.value
                    }
                  }
                })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Button Text</label>
              <input
                type="text"
                value={ctaProps.buttonText}
                onChange={(e) => setEditedComponent({
                  ...editedComponent,
                  props: {
                    ...editedComponent.props,
                    cta: {
                      ...ctaProps,
                      buttonText: e.target.value
                    }
                  }
                })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Button Link</label>
              <input
                type="text"
                value={ctaProps.buttonLink}
                onChange={(e) => setEditedComponent({
                  ...editedComponent,
                  props: {
                    ...editedComponent.props,
                    cta: {
                      ...ctaProps,
                      buttonLink: e.target.value
                    }
                  }
                })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Background Type</label>
              <select
                value={ctaProps.backgroundType}
                onChange={(e) => setEditedComponent({
                  ...editedComponent,
                  props: {
                    ...editedComponent.props,
                    cta: {
                      ...ctaProps,
                      backgroundType: e.target.value as 'solid' | 'gradient' | 'image'
                    }
                  }
                })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="solid">Solid</option>
                <option value="gradient">Gradient</option>
                <option value="image">Image</option>
              </select>
            </div>
          </div>
        );
      }

      case 'footer': {
        const footerProps = editedComponent.props.footer as ComponentProps['footer'];
        if (!footerProps) return null;

        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Logo URL</label>
              {renderImageField('footer', 'logo', footerProps.logo)}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                value={footerProps.description}
                onChange={(e) => setEditedComponent({
                  ...editedComponent,
                  props: {
                    ...editedComponent.props,
                    footer: {
                      ...footerProps,
                      description: e.target.value
                    }
                  }
                })}
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Links</label>
              <div className="space-y-2">
                {footerProps.links.map((link, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={link.title}
                      onChange={(e) => {
                        const newLinks = [...footerProps.links];
                        newLinks[index] = { ...link, title: e.target.value };
                        setEditedComponent({
                          ...editedComponent,
                          props: {
                            ...editedComponent.props,
                            footer: {
                              ...footerProps,
                              links: newLinks
                            }
                          }
                        });
                      }}
                      className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      placeholder="Link title"
                    />
                    <input
                      type="text"
                      value={link.url}
                      onChange={(e) => {
                        const newLinks = [...footerProps.links];
                        newLinks[index] = { ...link, url: e.target.value };
                        setEditedComponent({
                          ...editedComponent,
                          props: {
                            ...editedComponent.props,
                            footer: {
                              ...footerProps,
                              links: newLinks
                            }
                          }
                        });
                      }}
                      className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      placeholder="Link URL"
                    />
                    <button
                      onClick={() => {
                        const newLinks = footerProps.links.filter((_, i) => i !== index);
                        setEditedComponent({
                          ...editedComponent,
                          props: {
                            ...editedComponent.props,
                            footer: {
                              ...footerProps,
                              links: newLinks
                            }
                          }
                        });
                      }}
                      className="text-red-600 hover:text-red-800"
                    >
                      <FiTrash2 className="h-5 w-5" />
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => {
                    setEditedComponent({
                      ...editedComponent,
                      props: {
                        ...editedComponent.props,
                        footer: {
                          ...footerProps,
                          links: [
                            ...footerProps.links,
                            { title: '', url: '' }
                          ]
                        }
                      }
                    });
                  }}
                  className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800"
                >
                  <FiPlus className="mr-1 h-4 w-4" />
                  Add Link
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Social Links</label>
              <div className="space-y-2">
                {footerProps.socialLinks.map((link, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={link.platform}
                      onChange={(e) => {
                        const newLinks = [...footerProps.socialLinks];
                        newLinks[index] = { ...link, platform: e.target.value };
                        setEditedComponent({
                          ...editedComponent,
                          props: {
                            ...editedComponent.props,
                            footer: {
                              ...footerProps,
                              socialLinks: newLinks
                            }
                          }
                        });
                      }}
                      className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      placeholder="Platform name"
                    />
                    <input
                      type="text"
                      value={link.url}
                      onChange={(e) => {
                        const newLinks = [...footerProps.socialLinks];
                        newLinks[index] = { ...link, url: e.target.value };
                        setEditedComponent({
                          ...editedComponent,
                          props: {
                            ...editedComponent.props,
                            footer: {
                              ...footerProps,
                              socialLinks: newLinks
                            }
                          }
                        });
                      }}
                      className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      placeholder="Social URL"
                    />
                    <button
                      onClick={() => {
                        const newLinks = footerProps.socialLinks.filter((_, i) => i !== index);
                        setEditedComponent({
                          ...editedComponent,
                          props: {
                            ...editedComponent.props,
                            footer: {
                              ...footerProps,
                              socialLinks: newLinks
                            }
                          }
                        });
                      }}
                      className="text-red-600 hover:text-red-800"
                    >
                      <FiTrash2 className="h-5 w-5" />
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => {
                    setEditedComponent({
                      ...editedComponent,
                      props: {
                        ...editedComponent.props,
                        footer: {
                          ...footerProps,
                          socialLinks: [
                            ...footerProps.socialLinks,
                            { platform: '', url: '' }
                          ]
                        }
                      }
                    });
                  }}
                  className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800"
                >
                  <FiPlus className="mr-1 h-4 w-4" />
                  Add Social Link
                </button>
              </div>
            </div>
          </div>
        );
      }

      case 'stats': {
        const statsProps = editedComponent.props.stats as ComponentProps['stats'];
        if (!statsProps) return null;

        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Title</label>
              <input
                type="text"
                value={statsProps.title}
                onChange={(e) => setEditedComponent({
                  ...editedComponent,
                  props: {
                    ...editedComponent.props,
                    stats: {
                      ...statsProps,
                      title: e.target.value
                    }
                  }
                })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Layout</label>
              <select
                value={statsProps.layout}
                onChange={(e) => setEditedComponent({
                  ...editedComponent,
                  props: {
                    ...editedComponent.props,
                    stats: {
                      ...statsProps,
                      layout: e.target.value as 'grid' | 'list'
                    }
                  }
                })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="grid">Grid</option>
                <option value="list">List</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Stats</label>
              <div className="space-y-4">
                {statsProps.items.map((item, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <input
                        type="text"
                        value={item.label}
                        onChange={(e) => {
                          const newItems = [...statsProps.items];
                          newItems[index] = { ...item, label: e.target.value };
                          setEditedComponent({
                            ...editedComponent,
                            props: {
                              ...editedComponent.props,
                              stats: {
                                ...statsProps,
                                items: newItems
                              }
                            }
                          });
                        }}
                        className="text-lg font-medium rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        placeholder="Stat label"
                      />
                      <button
                        onClick={() => {
                          const newItems = statsProps.items.filter((_, i) => i !== index);
                          setEditedComponent({
                            ...editedComponent,
                            props: {
                              ...editedComponent.props,
                              stats: {
                                ...statsProps,
                                items: newItems
                              }
                            }
                          });
                        }}
                        className="text-red-600 hover:text-red-800"
                      >
                        <FiTrash2 className="h-5 w-5" />
                      </button>
                    </div>
                    <div className="space-y-2">
                      <input
                        type="text"
                        value={item.value}
                        onChange={(e) => {
                          const newItems = [...statsProps.items];
                          newItems[index] = { ...item, value: e.target.value };
                          setEditedComponent({
                            ...editedComponent,
                            props: {
                              ...editedComponent.props,
                              stats: {
                                ...statsProps,
                                items: newItems
                              }
                            }
                          });
                        }}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        placeholder="Stat value"
                      />
                      <input
                        type="text"
                        value={item.description}
                        onChange={(e) => {
                          const newItems = [...statsProps.items];
                          newItems[index] = { ...item, description: e.target.value };
                          setEditedComponent({
                            ...editedComponent,
                            props: {
                              ...editedComponent.props,
                              stats: {
                                ...statsProps,
                                items: newItems
                              }
                            }
                          });
                        }}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        placeholder="Stat description"
                      />
                    </div>
                  </div>
                ))}
                <button
                  onClick={() => {
                    setEditedComponent({
                      ...editedComponent,
                      props: {
                        ...editedComponent.props,
                        stats: {
                          ...statsProps,
                          items: [
                            ...statsProps.items,
                            {
                              label: '',
                              value: '',
                              description: ''
                            }
                          ]
                        }
                      }
                    });
                  }}
                  className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800"
                >
                  <FiPlus className="mr-1 h-4 w-4" />
                  Add Stat
                </button>
              </div>
            </div>
          </div>
        );
      }

      case 'team': {
        const teamProps = editedComponent.props.team as ComponentProps['team'];
        if (!teamProps) return null;

        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Title</label>
              <input
                type="text"
                value={teamProps.title}
                onChange={(e) => setEditedComponent({
                  ...editedComponent,
                  props: {
                    ...editedComponent.props,
                    team: {
                      ...teamProps,
                      title: e.target.value
                    }
                  }
                })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Layout</label>
              <select
                value={teamProps.layout}
                onChange={(e) => setEditedComponent({
                  ...editedComponent,
                  props: {
                    ...editedComponent.props,
                    team: {
                      ...teamProps,
                      layout: e.target.value as 'grid' | 'list'
                    }
                  }
                })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="grid">Grid</option>
                <option value="list">List</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Team Members</label>
              <div className="space-y-4">
                {teamProps.members.map((member, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <input
                        type="text"
                        value={member.name}
                        onChange={(e) => {
                          const newMembers = [...teamProps.members];
                          newMembers[index] = { ...member, name: e.target.value };
                          setEditedComponent({
                            ...editedComponent,
                            props: {
                              ...editedComponent.props,
                              team: {
                                ...teamProps,
                                members: newMembers
                              }
                            }
                          });
                        }}
                        className="text-lg font-medium rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        placeholder="Member name"
                      />
                      <button
                        onClick={() => {
                          const newMembers = teamProps.members.filter((_, i) => i !== index);
                          setEditedComponent({
                            ...editedComponent,
                            props: {
                              ...editedComponent.props,
                              team: {
                                ...teamProps,
                                members: newMembers
                              }
                            }
                          });
                        }}
                        className="text-red-600 hover:text-red-800"
                      >
                        <FiTrash2 className="h-5 w-5" />
                      </button>
                    </div>
                    <div className="space-y-2">
                      <input
                        type="text"
                        value={member.role}
                        onChange={(e) => {
                          const newMembers = [...teamProps.members];
                          newMembers[index] = { ...member, role: e.target.value };
                          setEditedComponent({
                            ...editedComponent,
                            props: {
                              ...editedComponent.props,
                              team: {
                                ...teamProps,
                                members: newMembers
                              }
                            }
                          });
                        }}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        placeholder="Member role"
                      />
                      <textarea
                        value={member.bio}
                        onChange={(e) => {
                          const newMembers = [...teamProps.members];
                          newMembers[index] = { ...member, bio: e.target.value };
                          setEditedComponent({
                            ...editedComponent,
                            props: {
                              ...editedComponent.props,
                              team: {
                                ...teamProps,
                                members: newMembers
                              }
                            }
                          });
                        }}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        placeholder="Member bio"
                      />
                      <input
                        type="text"
                        value={member.imageUrl}
                        onChange={(e) => {
                          const newMembers = [...teamProps.members];
                          newMembers[index] = { ...member, imageUrl: e.target.value };
                          setEditedComponent({
                            ...editedComponent,
                            props: {
                              ...editedComponent.props,
                              team: {
                                ...teamProps,
                                members: newMembers
                              }
                            }
                          });
                        }}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        placeholder="Member image URL"
                      />
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Social Links</label>
                        {member.socialLinks.map((link, linkIndex) => (
                          <div key={linkIndex} className="flex items-center gap-2">
                            <input
                              type="text"
                              value={link.platform}
                              onChange={(e) => {
                                const newLinks = [...member.socialLinks];
                                newLinks[linkIndex] = { ...link, platform: e.target.value };
                                const newMembers = [...teamProps.members];
                                newMembers[index] = { ...member, socialLinks: newLinks };
                                setEditedComponent({
                                  ...editedComponent,
                                  props: {
                                    ...editedComponent.props,
                                    team: {
                                      ...teamProps,
                                      members: newMembers
                                    }
                                  }
                                });
                              }}
                              className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                              placeholder="Platform name"
                            />
                            <input
                              type="text"
                              value={link.url}
                              onChange={(e) => {
                                const newLinks = [...member.socialLinks];
                                newLinks[linkIndex] = { ...link, url: e.target.value };
                                const newMembers = [...teamProps.members];
                                newMembers[index] = { ...member, socialLinks: newLinks };
                                setEditedComponent({
                                  ...editedComponent,
                                  props: {
                                    ...editedComponent.props,
                                    team: {
                                      ...teamProps,
                                      members: newMembers
                                    }
                                  }
                                });
                              }}
                              className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                              placeholder="Social URL"
                            />
                            <button
                              onClick={() => {
                                const newLinks = member.socialLinks.filter((_, i) => i !== linkIndex);
                                const newMembers = [...teamProps.members];
                                newMembers[index] = { ...member, socialLinks: newLinks };
                                setEditedComponent({
                                  ...editedComponent,
                                  props: {
                                    ...editedComponent.props,
                                    team: {
                                      ...teamProps,
                                      members: newMembers
                                    }
                                  }
                                });
                              }}
                              className="text-red-600 hover:text-red-800"
                            >
                              <FiTrash2 className="h-5 w-5" />
                            </button>
                          </div>
                        ))}
                        <button
                          onClick={() => {
                            const newLinks = [...member.socialLinks, { platform: '', url: '' }];
                            const newMembers = [...teamProps.members];
                            newMembers[index] = { ...member, socialLinks: newLinks };
                            setEditedComponent({
                              ...editedComponent,
                              props: {
                                ...editedComponent.props,
                                team: {
                                  ...teamProps,
                                  members: newMembers
                                }
                              }
                            });
                          }}
                          className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800"
                        >
                          <FiPlus className="mr-1 h-4 w-4" />
                          Add Social Link
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                <button
                  onClick={() => {
                    setEditedComponent({
                      ...editedComponent,
                      props: {
                        ...editedComponent.props,
                        team: {
                          ...teamProps,
                          members: [
                            ...teamProps.members,
                            {
                              name: '',
                              role: '',
                              bio: '',
                              imageUrl: '',
                              socialLinks: []
                            }
                          ]
                        }
                      }
                    });
                  }}
                  className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800"
                >
                  <FiPlus className="mr-1 h-4 w-4" />
                  Add Team Member
                </button>
              </div>
            </div>
          </div>
        );
      }

      case 'blog': {
        const blogProps = editedComponent.props.blog as ComponentProps['blog'];
        if (!blogProps) return null;

        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Title</label>
              <input
                type="text"
                value={blogProps.title}
                onChange={(e) => setEditedComponent({
                  ...editedComponent,
                  props: {
                    ...editedComponent.props,
                    blog: {
                      ...blogProps,
                      title: e.target.value
                    }
                  }
                })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Layout</label>
              <select
                value={blogProps.layout}
                onChange={(e) => setEditedComponent({
                  ...editedComponent,
                  props: {
                    ...editedComponent.props,
                    blog: {
                      ...blogProps,
                      layout: e.target.value as 'grid' | 'list'
                    }
                  }
                })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="grid">Grid</option>
                <option value="list">List</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Blog Posts</label>
              <div className="space-y-4">
                {blogProps.posts.map((post, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <input
                        type="text"
                        value={post.title}
                        onChange={(e) => {
                          const newPosts = [...blogProps.posts];
                          newPosts[index] = { ...post, title: e.target.value };
                          setEditedComponent({
                            ...editedComponent,
                            props: {
                              ...editedComponent.props,
                              blog: {
                                ...blogProps,
                                posts: newPosts
                              }
                            }
                          });
                        }}
                        className="text-lg font-medium rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        placeholder="Post title"
                      />
                      <button
                        onClick={() => {
                          const newPosts = blogProps.posts.filter((_, i) => i !== index);
                          setEditedComponent({
                            ...editedComponent,
                            props: {
                              ...editedComponent.props,
                              blog: {
                                ...blogProps,
                                posts: newPosts
                              }
                            }
                          });
                        }}
                        className="text-red-600 hover:text-red-800"
                      >
                        <FiTrash2 className="h-5 w-5" />
                      </button>
                    </div>
                    <div className="space-y-2">
                      <textarea
                        value={post.excerpt}
                        onChange={(e) => {
                          const newPosts = [...blogProps.posts];
                          newPosts[index] = { ...post, excerpt: e.target.value };
                          setEditedComponent({
                            ...editedComponent,
                            props: {
                              ...editedComponent.props,
                              blog: {
                                ...blogProps,
                                posts: newPosts
                              }
                            }
                          });
                        }}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        placeholder="Post excerpt"
                      />
                      <input
                        type="text"
                        value={post.imageUrl}
                        onChange={(e) => {
                          const newPosts = [...blogProps.posts];
                          newPosts[index] = { ...post, imageUrl: e.target.value };
                          setEditedComponent({
                            ...editedComponent,
                            props: {
                              ...editedComponent.props,
                              blog: {
                                ...blogProps,
                                posts: newPosts
                              }
                            }
                          });
                        }}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        placeholder="Post image URL"
                      />
                      <input
                        type="text"
                        value={post.author}
                        onChange={(e) => {
                          const newPosts = [...blogProps.posts];
                          newPosts[index] = { ...post, author: e.target.value };
                          setEditedComponent({
                            ...editedComponent,
                            props: {
                              ...editedComponent.props,
                              blog: {
                                ...blogProps,
                                posts: newPosts
                              }
                            }
                          });
                        }}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        placeholder="Author name"
                      />
                      <input
                        type="text"
                        value={post.date}
                        onChange={(e) => {
                          const newPosts = [...blogProps.posts];
                          newPosts[index] = { ...post, date: e.target.value };
                          setEditedComponent({
                            ...editedComponent,
                            props: {
                              ...editedComponent.props,
                              blog: {
                                ...blogProps,
                                posts: newPosts
                              }
                            }
                          });
                        }}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        placeholder="Post date"
                      />
                    </div>
                  </div>
                ))}
                <button
                  onClick={() => {
                    setEditedComponent({
                      ...editedComponent,
                      props: {
                        ...editedComponent.props,
                        blog: {
                          ...blogProps,
                          posts: [
                            ...blogProps.posts,
                            {
                              title: '',
                              excerpt: '',
                              imageUrl: '',
                              author: '',
                              date: ''
                            }
                          ]
                        }
                      }
                    });
                  }}
                  className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800"
                >
                  <FiPlus className="mr-1 h-4 w-4" />
                  Add Blog Post
                </button>
              </div>
            </div>
          </div>
        );
      }

      case 'contact': {
        const contactProps = editedComponent.props.contact as ComponentProps['contact'];
        if (!contactProps) return null;

        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Title</label>
              <input
                type="text"
                value={contactProps.title}
                onChange={(e) => setEditedComponent({
                  ...editedComponent,
                  props: {
                    ...editedComponent.props,
                    contact: {
                      ...contactProps,
                      title: e.target.value
                    }
                  }
                })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Layout</label>
              <select
                value={contactProps.layout}
                onChange={(e) => setEditedComponent({
                  ...editedComponent,
                  props: {
                    ...editedComponent.props,
                    contact: {
                      ...contactProps,
                      layout: e.target.value as 'split' | 'centered'
                    }
                  }
                })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="split">Split</option>
                <option value="centered">Centered</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Form Fields</label>
              <div className="space-y-4">
                {contactProps.formFields.map((field, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <input
                        type="text"
                        value={field.label}
                        onChange={(e) => {
                          const newFields = [...contactProps.formFields];
                          newFields[index] = { ...field, label: e.target.value };
                          setEditedComponent({
                            ...editedComponent,
                            props: {
                              ...editedComponent.props,
                              contact: {
                                ...contactProps,
                                formFields: newFields
                              }
                            }
                          });
                        }}
                        className="text-lg font-medium rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        placeholder="Field label"
                      />
                      <button
                        onClick={() => {
                          const newFields = contactProps.formFields.filter((_, i) => i !== index);
                          setEditedComponent({
                            ...editedComponent,
                            props: {
                              ...editedComponent.props,
                              contact: {
                                ...contactProps,
                                formFields: newFields
                              }
                            }
                          });
                        }}
                        className="text-red-600 hover:text-red-800"
                      >
                        <FiTrash2 className="h-5 w-5" />
                      </button>
                    </div>
                    <div className="space-y-2">
                      <select
                        value={field.type}
                        onChange={(e) => {
                          const newFields = [...contactProps.formFields];
                          newFields[index] = { ...field, type: e.target.value as 'text' | 'email' | 'textarea' };
                          setEditedComponent({
                            ...editedComponent,
                            props: {
                              ...editedComponent.props,
                              contact: {
                                ...contactProps,
                                formFields: newFields
                              }
                            }
                          });
                        }}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      >
                        <option value="text">Text</option>
                        <option value="email">Email</option>
                        <option value="textarea">Textarea</option>
                      </select>
                      <input
                        type="text"
                        value={field.placeholder}
                        onChange={(e) => {
                          const newFields = [...contactProps.formFields];
                          newFields[index] = { ...field, placeholder: e.target.value };
                          setEditedComponent({
                            ...editedComponent,
                            props: {
                              ...editedComponent.props,
                              contact: {
                                ...contactProps,
                                formFields: newFields
                              }
                            }
                          });
                        }}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        placeholder="Field placeholder"
                      />
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={field.required}
                          onChange={(e) => {
                            const newFields = [...contactProps.formFields];
                            newFields[index] = { ...field, required: e.target.checked };
                            setEditedComponent({
                              ...editedComponent,
                              props: {
                                ...editedComponent.props,
                                contact: {
                                  ...contactProps,
                                  formFields: newFields
                                }
                              }
                            });
                          }}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label className="ml-2 block text-sm text-gray-900">
                          Required field
                        </label>
                      </div>
                    </div>
                  </div>
                ))}
                <button
                  onClick={() => {
                    setEditedComponent({
                      ...editedComponent,
                      props: {
                        ...editedComponent.props,
                        contact: {
                          ...contactProps,
                          formFields: [
                            ...contactProps.formFields,
                            {
                              label: '',
                              type: 'text',
                              placeholder: '',
                              required: false
                            }
                          ]
                        }
                      }
                    });
                  }}
                  className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800"
                >
                  <FiPlus className="mr-1 h-4 w-4" />
                  Add Form Field
                </button>
              </div>
            </div>
          </div>
        );
      }

      default:
        return (
          <div className="text-sm text-gray-500">
            Visual editor not available for this component type
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium text-gray-900">
              Edit {component.type.charAt(0).toUpperCase() + component.type.slice(1)} Component
            </h2>
            <button
              onClick={onCancel}
              className="text-gray-400 hover:text-gray-500"
            >
              <FiX className="h-6 w-6" />
            </button>
          </div>

          <div className="space-y-6">
            {renderEditorFields()}
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <button
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <FiSave className="-ml-1 mr-2 h-5 w-5" />
              Save Changes
            </button>
          </div>
        </div>
      </div>

      {showImageGallery && (
        <ImageGallery
          onSelect={handleImageSelect}
          onClose={() => {
            setShowImageGallery(false);
            setCurrentImageField(null);
          }}
        />
      )}
    </div>
  );
} 